/*
/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
efememdb.js

Easy, Fast and Efficient MEMory NoSQL DataBase
Version 1.0.5

Created by Rafael Hernamperez and released under the terms of the ISC License:
https://opensource.org/licenses/ISC



ISC License (ISC)
Copyright 2020 Rafael Hernamperez

Permission to use, copy, modify, and/or distribute this software for any 
purpose with or without fee is hereby granted, provided that the above 
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY 
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, 
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM 
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR 
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR 
PERFORMANCE OF THIS SOFTWARE.
\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
*/

let webEnv = false;
let efememconf = {};
let path;
let fs;

// Determine the current environment
try {
  // NodeJS Environment
  process.version; // If not NodeJS this will cause an exception (Web)
  webEnv = false;
  efememconf = require("./efememdb.json");
  path = require("path");
  fs = require("fs");
} catch (err) {
  // Web Environment
  webEnv = true;
  efememconf.accessKey =
    "!X~*zW7m:Zlzp^3%=*$*mc6$4ZW^D4=e2|^I-6X2D4X|7-n][{-+4Mg=t&^~@Xfp";
  efememconf.maxMemory = 1048576;
  efememconf.maxKeys = 1000;
  efememconf.recyclingMode = false;
  efememconf.dataPath = "";
}

// Main constants
const KEY_MAX_LENGTH = 100;
const SPACE_MAX_LENGTH = 24;
const VALID_KEY = /[^0-9a-zA-Z|#:_.]+/g;
const VALID_SPACE = /[^0-9a-zA-Z]+/g;

// EFEMemDB class
// Properties:
//   - spkeys[] => space@key array. Contains all spaces and keys
//   - data[]   => Array with all values
//   - version  => EFEMemDB version
//   - config   => Configuration
//
// Methods:
//   - constructor()
//   - info()
//   - set()
//   - keys()
//   - spaces()
//   - check()
//   - get()
//   - values()
//   - delete()
//   - rename()
//   - move()
//   - stats()
//   - memory()
//   - getConfig()
//   - setConfig()
//   - persist()
//   - restore()
//
class EFEMemDB {
  // Constructor
  constructor() {
    this.spkeys = [];
    this.data = [];
    this.version = `1.0.5`;
    this.config = {
      accessKey: efememconf.hasOwnProperty("accessKey")
        ? efememconf.accessKey
        : getRandomKey(64),
      maxMemory: efememconf.hasOwnProperty("maxMemory")
        ? efememconf.maxMemory
        : 1048576,
      maxKeys: efememconf.hasOwnProperty("maxKeys") ? efememconf.maxKeys : 1000,
      recyclingMode: efememconf.hasOwnProperty("recyclingMode")
        ? efememconf.recyclingMode
        : false,
      dataPath: efememconf.hasOwnProperty("dataPath")
        ? efememconf.dataPath
        : "",
    };

    this.webEnv = webEnv;

    this.restore();
  }

  /**
   * Returns the complete status info of EFEMem Database
   */
  info() {
    const spaces = this.spaces();
    const env = this.webEnv ? "Web" : "NodeJS";
    const lf = this.webEnv ? "</br>" : "\n";

    let info = `EFEMem NoSQL DataBase version ${this.version}${lf}${lf}`;
    info += `Environment: ${env}${lf}`;
    info += `Configuration: ${JSON.stringify(this.config, null, 2)}${lf}`;
    info += `Memory usage: ${JSON.stringify(this.memory(), null, 2)}${lf}`;

    if (Object.prototype.toString.call(spaces.data) != "[object Array]")
      info += `Total spaces: 0${lf}`;
    else {
      info += `Total spaces: ${spaces.data.length}${lf}`;
      info += `   ${JSON.stringify(spaces.data)}${lf}`;
    }

    info += `Total keys: ${this.spkeys.length} of ${this.config.maxKeys}${lf}`;

    return info;
  }

  /**
   * Sets the value for a given key. If previous key exits, owerwrite it, else create it
   * @param {string} key => Mandatory. Key name
   * @param {any} value => Mandatory. Value as valid JSON, string, number or boolean
   * @param {string} space => Optional. Name of space ('public' by default)
   * @param {int} due => Life expressed on seconds. -1 if inmmortal (by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  set(key, value, space, due) {
    const start = new Date();

    // Validations
    if (key == undefined || key == null)
      return {
        ok: false,
        cmd: "set()",
        data: {},
        msg: "Error on key: No key provided",
        affected: 0,
      };

    if (value == undefined || key == null)
      return {
        ok: false,
        cmd: "set()",
        data: {},
        msg: "Error on value: No value provided",
        affected: 0,
      };

    if (due == undefined || due == null) due = -1;

    if (isNaN(due))
      return {
        ok: false,
        cmd: "set()",
        data: {},
        msg: "Error on due: Must be a number",
        affected: 0,
      };

    // Validate space name
    if (space == undefined || space == null || space == "") space = "public";

    let validation = validateEntity(
      space,
      SPACE_MAX_LENGTH,
      new RegExp(VALID_SPACE)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "set()",
        data: value,
        msg: `Error on space: ${validation.msg}`,
        affected: 0,
      };

    // Validate key name
    validation = validateEntity(key, KEY_MAX_LENGTH, new RegExp(VALID_KEY));

    if (!validation.ok)
      return {
        ok: false,
        cmd: "set()",
        data: value,
        msg: `Error on key: ${validation.msg}`,
        affected: 0,
      };

    // Compose real key (space@key) and data
    const realKey = `${space}@${key}`;

    //const now = new Date().toISOString();
    const now = getLocalNow();
    const dueTime = getDueTime(due);

    const data = {
      value: value,
      due: dueTime,
      updated: now,
    };

    let idx = this.spkeys.indexOf(realKey);

    // If not exists previously, add it
    if (idx < 0) {
      const mem = this.memory().usedMemory;

      // if maximum memory has been reached
      if (mem > this.config.maxMemory)
        return {
          ok: false,
          cmd: "set()",
          data: value,
          msg: `Key '${key}' cannot be saved. Maximum memory (${this.config.maxMemory}) has been reached. Used ${mem}`,
          affected: 0,
        };

      // If maximum number of keys has been reached
      if (this.spkeys.length >= this.config.maxKeys)
        if (!this.config.recyclingMode)
          // if not recycling mode dont's save ky
          return {
            ok: false,
            cmd: "set()",
            data: value,
            msg: `Key '${key}' cannot be saved. Maximum number of keys (${this.config.maxKeys}) has been reached`,
            affected: 0,
          };
        // else recycling mode, deletes the first key
        else deleteIndex(0);

      data.created = now;

      this.spkeys.push(realKey);
      this.data.push(data);
    } else {
      // If exists overwrite it
      data.created = this.data[idx].created;

      this.spkeys[idx] = realKey;
      this.data[idx] = data;
    }

    return {
      ok: true,
      cmd: "set()",
      data: data,
      msg: `Key '${key}' saved successfully in space '${space}'`,
      affected: 1,
      time: finishTime(start),
    };
  } // function set()

  /**
   * Get the list of keys based on a pattern and/or space
   * @param {string} key => Optional. Pattern of the name of key
   * @param {string} space => Optional. Pattern of the name of space
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: [key_names], msg: 'message', affected: number, time: 'execution_time' }
   */
  keys(key, space) {
    const start = new Date();

    if (key === undefined || key === null || key === "*") key = "";

    if (space === undefined || space === null || space === "*") space = "";

    let spaces = [],
      keys = [],
      result = [];

    // Separate spaces and keys from the key (space@key)
    for (var spaceKey of this.spkeys) {
      const spaceKeys = spaceKey.split("@");
      spaces.push(spaceKeys[0]);
      keys.push(spaceKeys[1]);
    }

    spaces.map((item, idx) => {
      if (space != "") {
        // if space pattern provided
        if (item.indexOf(space) >= 0) {
          // space matching
          if (key != "") {
            // if not key pattern provided
            if (keys[idx].indexOf(key) >= 0)
              result.push({ space: item, key: keys[idx] });
          } // key pattern provided
          else result.push({ space: item, key: keys[idx] });
        }
      } else {
        // space not provided
        if (key != "") {
          // if not key pattern provided
          if (keys[idx].indexOf(key) >= 0)
            result.push({ space: item, key: keys[idx] });
        } // key pattern provided
        else result.push({ space: item, key: keys[idx] });
      }
    }); // map()

    return {
      ok: true,
      cmd: "keys()",
      data: result,
      msg: `Keys for '${key}' and space '${space}' patterns retrieved successfully`,
      affected: result.length,
      time: finishTime(start),
    };
  } // function keys()

  /**
   * Get the list of spaces used currently
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: [space_names]], msg: 'message', affected: number, time: 'execution_time' }
   */
  spaces() {
    const start = new Date();

    let spaces = [];

    for (const item of this.spkeys) {
      const space = item.split("@")[0];

      if (spaces.indexOf(space) < 0) spaces.push(space);
    }

    if (spaces.length > 0)
      return {
        ok: true,
        cmd: "spaces()",
        data: spaces.sort(),
        msg: `${spaces.length} spaces used`,
        affected: spaces.length,
        time: finishTime(start),
      };
    else
      return {
        ok: true,
        cmd: "spaces()",
        data: {},
        msg: `No space used`,
        affected: 0,
        time: finishTime(start),
      };
  } // function spaces()

  /**
   * Checks a given key into a given space
   * @param {string} key => Key name
   * @param {string} space => Space name ('public' by default)
   * @returns {JSON} => { ok: true | false, msg: "message", pos: index_position }
   */
  check(key, space = "public") {
    // Validation
    if (key == undefined || key == null || key == "")
      return {
        ok: false,
        msg: "Error: No key provided",
      };

    let validation = validateEntity(key, KEY_MAX_LENGTH, new RegExp(VALID_KEY));

    if (!validation.ok)
      return {
        ok: false,
        msg: `Error on key: ${validation.msg}`,
      };

    validation = validateEntity(
      space,
      SPACE_MAX_LENGTH,
      new RegExp(VALID_SPACE)
    );

    if (!validation.ok)
      return {
        ok: false,
        msg: `Error on space: ${validation.msg}`,
      };

    const realKey = `${space}@${key}`;

    const idx = this.spkeys.indexOf(realKey);

    if (idx < 0)
      return {
        ok: false,
        msg: `Error: key '${key}' in space '${space}' not found`,
      };

    return {
      ok: true,
      msg: `Key '${key}' in space '${space}' found`,
      pos: idx,
    };
  } // function check()

  /**
   * Gets the value for a given key
   * @param {string} key => Key name
   * @param {string} space => Optional. Space name ('public' by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  get(key, space = "public") {
    const start = new Date();
    const checked = this.check(key, space);

    if (!checked.ok)
      return {
        ok: false,
        cmd: "get()",
        data: {},
        msg: checked.msg,
        affected: 0,
      };

    const now = getLocalNow().toISOString();

    // If due time is over
    if (this.data[checked.pos].due < now) {
      deleteIndex(checked.pos); // delete key

      return {
        ok: true,
        cmd: "get()",
        data: {},
        msg: `Key '${key == undefined || key == null ? "*" : key}' in space '${
          space == undefined || space == null ? "*" : space
        }' not found`,
        affected: 0,
      };
    }

    return {
      ok: true,
      cmd: "get()",
      data: this.data[checked.pos],
      msg: `Key '${key == undefined || key == null ? "*" : key}' in space '${
        space == undefined || space == null ? "*" : space
      }' found and retrieved successfully`,
      affected: 1,
      time: finishTime(start),
    };
  } // function get()

  /**
   * Get the list of values based on a pattern and/or space
   * @param {string} key => Optional. Pattern of the name of key
   * @param {string} space => Optional. Pattern of the name of space
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: [{values}], msg: 'message', affected: number, time: 'execution_time' }
   */
  values(key, space) {
    const start = new Date();

    // Get key name
    const keys = this.keys(key, space).data;

    let result = [];

    // for each key name
    for (const item of keys) {
      // if valid key name
      if (item !== undefined && item !== null) {
        const value = this.get(item.key, item.space);

        if (value.ok && value.affected > 0) {
          result.push({
            key: item.key,
            space: item.space,
            value: value.data.value,
            created:
              typeof value.data.created != "string"
                ? value.data.created.toISOString()
                : value.data.created,
            updated:
              typeof value.data.updated != "string"
                ? value.data.updated.toISOString()
                : value.data.updated,
            due: value.data.due,
          });
        }
      } // valid item
    } // for

    // if keys found
    if (result.length > 0)
      return {
        ok: true,
        cmd: "values()",
        data: result,
        msg: `${result.length} values found and retrieved for Key '${
          key == undefined || key == null ? "*" : key
        }' in space '${space == undefined || key == null ? "*" : space}'`,
        affected: result.length,
        time: finishTime(start),
      };

    // No key faound
    return {
      ok: true,
      cmd: "values()",
      data: {},
      msg: `No values found for key '${
        key == undefined || key == null ? "*" : key
      }' in space '${space == undefined || space == null ? "*" : space}'`,
      affected: 0,
      time: finishTime(start),
    };
  } // function values()

  /**
   * Deletes the value of a given key
   * @param {string} key => Key to be deleted
   * @param {string} space => Optional. Space name ('public' by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {deleted_value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  delete(key, space = "public") {
    const start = new Date();
    const checked = this.check(key, space);

    if (!checked.ok)
      return {
        ok: false,
        cmd: "delete()",
        data: {},
        msg: checked.msg,
        affected: 0,
        time: finishTime(start),
      };

    const data = getKeyDetail(checked.pos);

    deleteIndex(checked.pos);

    return {
      ok: true,
      cmd: "delete()",
      ...data,
      msg: `Key '${key}' in space '${space}' deleted successfully`,
      affected: 1,
      time: finishTime(start),
    };
  } // function delete()

  /**
   * Renames a given key
   * @param {string} key => Current key name
   * @param {string} newKey => New key name
   * @param {string} space => Space name ('public' by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  rename(key, newKey, space = "public") {
    const start = new Date();
    const checked = this.check(key, space);

    if (!checked.ok)
      return {
        ok: false,
        cmd: "rename()",
        data: {},
        msg: checked.msg,
        affected: 0,
        time: finishTime(start),
      };

    if (newKey == undefined || newKey == null || newKey == "")
      return {
        ok: false,
        cmd: "rename()",
        data: {},
        msg: "Error: No new key provided",
        affected: 0,
        time: finishTime(start),
      };

    let validation = validateEntity(
      newKey,
      KEY_MAX_LENGTH,
      new RegExp(VALID_KEY)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "rename()",
        data: {},
        msg: `Error on new key: ${validation.msg}`,
        affected: 0,
        time: finishTime(start),
      };

    // Change key name
    this.spkeys[checked.pos] = `${space}@${newKey}`;

    return {
      ok: true,
      cmd: "rename()",
      data: this.data[checked.pos].value,
      msg: `Key '${key}' at space '${space}' was renamed as '${newKey}'`,
      affected: 1,
      time: finishTime(start),
    };
  } // function rename()

  /**
   * Moves a given key from a given space to another space
   * @param {string} key => Key name
   * @param {string} space => Space name (origin. 'public' as default)
   * @param {string} newSpace  => New space name (destination. 'public' as default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  move(key, space, newSpace = "public") {
    const start = new Date();

    if (space == undefined || space == null || space == "") space = "public";

    // Validate if exists the origin space and key
    let originChecked = this.check(key, space);

    if (!originChecked.ok)
      return {
        ok: false,
        cmd: "move()",
        data: {},
        msg: originChecked.msg,
        affected: 0,
        time: finishTime(start),
      };

    // Validate the space destination
    let validation = validateEntity(
      newSpace,
      SPACE_MAX_LENGTH,
      new RegExp(VALID_SPACE)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "move()",
        data: {},
        msg: `Error on new space: ${validation.msg}`,
        affected: 0,
        time: finishTime(start),
      };

    // If new key/space already exists, delete it
    let destinationChecked = this.check(key, newSpace);

    if (destinationChecked.ok) deleteIndex(destinationChecked.pos);

    // Change the current key/space
    this.spkeys[originChecked.pos] = `${newSpace}@${key}`;

    return {
      ok: true,
      cmd: "move()",
      data: this.data[originChecked.pos].value,
      msg: `Key '${key}' at space '${space}' was moved to space '${newSpace}'`,
      affected: 1,
      time: finishTime(start),
    };
  } // function move()

  /**
   * Copies a given key from a given space to another space
   * @param {string} key => Key name
   * @param {string} space => Space name (origin. 'public' as default)
   * @param {string} newKey  => New key name (destination. The same, as default)
   * @param {string} newSpace  => New space name (destination. 'public' as default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  copy(key, space, newKey, newSpace = "public") {
    const start = new Date();

    if (newKey == undefined || newKey == null || newKey == "") newKey = key;

    if (space == undefined || space == null || space == "") space = "public";

    // Validate the origin space and key
    const checked = this.check(key, space);

    if (!checked.ok)
      return {
        ok: false,
        cmd: "copy()",
        data: {},
        msg: `Origin key - ${checked.msg}`,
        affected: 0,
        time: finishTime(start),
      };

    // Validate the key destination
    let validation = validateEntity(
      newKey,
      KEY_MAX_LENGTH,
      new RegExp(VALID_KEY)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "move()",
        data: {},
        msg: `Error on destination key: ${validation.msg}`,
        affected: 0,
        time: finishTime(start),
      };

    // Validate the space destination
    validation = validateEntity(
      newSpace,
      SPACE_MAX_LENGTH,
      new RegExp(VALID_SPACE)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "copy()",
        data: {},
        msg: `Error on destination space: ${validation.msg}`,
        affected: 0,
        time: finishTime(start),
      };

    // Validate if origin and destination are equal
    if (key == newKey && space == newSpace) {
      return {
        ok: false,
        cmd: "copy()",
        data: {},
        msg: "No key copied. Origin and destination are the same",
        affected: 0,
        time: finishTime(start),
      };
    }

    // Copy key from origin to destination
    let origin = this.get(key, space);

    this.set(newKey, origin.data.value, newSpace);

    // update dates into destination
    const pos = this.spkeys.indexOf(`${newSpace}@${newKey}`);
    this.data[pos].due = origin.data.due;
    this.data[pos].created = origin.data.created;
    this.data[pos].updated = origin.data.updated;

    return {
      ok: true,
      cmd: "copy()",
      data: this.data[checked.pos].value,
      msg: `Key '${key}' at space '${space}' was copied to key '${newKey}' at space '${newSpace}'`,
      affected: 1,
      time: finishTime(start),
    };
  } // function move()

  /**
   *  Calculates some statistics operations over the keys matched with the patterns passed as parameters
   * @param {string} key => Optional. Pattern of the name of key (all by default)
   * @param {string} space => Optional. Pattern of the name of space (all by default)
   */
  stats(key, space) {
    const start = new Date();

    if (key === undefined || key === null || key === "*") key = "";

    if (space === undefined || space === null || space === "*") space = "";

    let sum = 0,
      min = Number.MAX_VALUE,
      max = Number.MIN_VALUE,
      count = 0,
      avg = 0,
      variance = 0,
      std = 0,
      idx = 0;

    let values = [];

    // Spaces and keys loop
    for (const item of this.spkeys) {
      const spkey = item.split("@");
      const spacex = spkey[0];
      const keyx = spkey[1];

      // if space and key found
      if (spacex.indexOf(space) >= 0 && keyx.indexOf(key) >= 0) {
        let value = this.data[idx].value;

        if (!isNaN(value) && typeof value != "boolean") {
          value = Number(value);
          values.push(value);
          count++;
          sum += value;
          if (value < min) min = value;
          if (value > max) max = value;
        }
      } // If space & key found

      idx++;
    } // map

    // Calculate de average
    avg = sum / count;

    // Calculate the variance
    for (const item of values)
      variance = variance + (item - avg) * (item - avg);

    variance = variance / (count - 1);

    return {
      ok: true,
      cmd: "stats()",
      data: {
        count: count,
        sum: sum,
        min: min,
        max: max,
        avg: avg,
        var: variance,
        std: Math.sqrt(variance),
      },
      msg: `Statistics for '${key}' and space '${space}' patterns retrieved successfully`,
      affected: count,
      time: finishTime(start),
    };
  }

  /**
   * Get statistics about an space
   */
  spaceInfo(space = "public") {
    const start = new Date();

    // Get spaces
    const spaces = this.spaces();

    if (spaces.data.indexOf(space) < 0)
      return {
        ok: false,
        cmd: "spaceInfo()",
        data: {},
        msg: `Error: Space '${space}' not found`,
        affected: 0,
        time: finishTime(start),
      };

    // Prepare data
    let valuesSize = 0;
    let spaceSize = 0;
    let numKeys = 0;

    // Get keys for the current space
    const values = this.values("*", space);

    // For each key
    for (const value of values.data) {
      numKeys++;
      valuesSize += getValueSize(value.value);
      spaceSize +=
        getValueSize(value.due) +
        getValueSize(value.created) +
        getValueSize(value.updated) +
        getValueSize(value.key) +
        getValueSize(value.space) +
        1;
    }

    return {
      ok: true,
      cmd: "spaceInfo()",
      data: {
        space: space,
        keys: numKeys,
        valuesSize: valuesSize,
        spaceSize: spaceSize,
        totalSize: valuesSize + spaceSize,
      },
      msg: `Space '${space}' information retrieved successfully`,
      affected: numKeys,
      time: finishTime(start),
    };
  } // function spaceInfo()

  /**
   * Gets the size used: key size + value size + db size
   */
  memory() {
    let size = 0;

    for (const item of this.spkeys) size += getValueSize(item);

    for (const item of this.data) size += getValueSize(item);

    return {
      maxMemory: this.config.maxMemory,
      usedMemory: size,
      freeMemory: this.config.maxMemory - size,
    };
  } // function memory()

  /**
   * Gets the value of a given configuration parameter
   * @param {string} param => Configuration parameter name. By default, all parameters
   * @returns {JSON} => { ok: true | false, cmd: "command", data: param_value, msg: 'message', affected: number }
   */
  getConfig(param) {
    if (param == undefined || param == null || param == "" || param == "*")
      return {
        ok: true,
        cmd: "getConfig()",
        data: this.config,
        msg: `EFEMem DB configuration parameters were found`,
        affected: 0,
      };

    if (!this.config.hasOwnProperty(param))
      return {
        ok: false,
        cmd: "getConfig()",
        data: {},
        msg: `EFEMem DB configuration parameter name '${param}' not found`,
        affected: 0,
      };

    return {
      ok: true,
      cmd: "getConfig()",
      data: this.config[param],
      msg: `EFEMem DB configuration parameter name '${param}' found`,
      affected: 1,
    };
  } // function getConfig()

  /**
   * Sets a configuration parameter with a given value
   * @param {string} param => Configuration parameter name
   * @param {any} value => Value
   * @returns {JSON} => { ok: true | false, cmd: "command", data: param_value, msg: 'message', affected: number }
   */
  setConfig(param, value) {
    if (param == undefined || param == null)
      return {
        ok: false,
        cmd: "setConfig()",
        data: {},
        msg: `No configuration parameter provided`,
        affected: 0,
      };

    let validation = validateEntity(
      param,
      SPACE_MAX_LENGTH,
      new RegExp(VALID_SPACE)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "setConfig()",
        data: value,
        msg: `Error on configuration parameter: ${validation.msg}`,
        affected: 0,
      };

    if (value == undefined || value == null)
      return {
        ok: false,
        cmd: "setConfig()",
        data: {},
        msg: `No configuration value provided for parameter '${param}'`,
        affected: 0,
      };

    try {
      this.config[param] = value;

      return {
        ok: true,
        cmd: "setConfig()",
        data: value,
        msg: `EFEMem DB configuration parameter '${param}' was assigned with value '${value}'`,
        affected: 1,
      };
    } catch (error) {
      return {
        ok: false,
        cmd: "setConfig()",
        data: {},
        msg: `Error on configuration setting parameter '${param}' with value '${value}': '${error}'`,
        affected: 0,
      };
    } // catch()
  } // function setConfig()

  /**
   * Save physically all data into files (nodeJS environment) or into localStorage (web environment)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  persist() {
    const start = new Date();
    let numSpaces = 0;
    let numKeys = 0;

    try {
      const spaces = this.spaces();

      // Create index (list of spaces)
      if (this.webEnv)
        localStorage.setItem("efememdb-efs", spaces.data.toString());
      else {
        // NodeJS environment. Creates the index file (efememdb.efs (EFemem Spaces))
        let filename =
          this.config.dataPath != ""
            ? `${this.config.dataPath}${path.sep}efememdb.efs`
            : "efememdb.efs";

        // Delete existing index file
        if (fs.existsSync(filename)) fs.unlinkSync(filename);
        fs.appendFileSync(filename, `${spaces.data.toString()}`, "utf8");
      }

      // For each space
      for (const space of spaces.data) {
        numSpaces++;

        // Get the values of all the keys from the current space
        const values = this.values("", space);

        // Values for web environment
        let lines = [];

        // Filename for NodeJs environment: <space_name>.efd (EFememdb Data)
        let filename = "";

        // If NodeJS environment, delete previous data file
        if (!this.webEnv) {
          filename =
            this.config.dataPath != ""
              ? `${this.config.dataPath}${path.sep}${space}.efd`
              : `${space}.efd`;

          if (fs.existsSync(filename)) fs.unlinkSync(filename);
        }

        // For each key/value
        for (const value of values.data) {
          const now = getLocalNow().toISOString();

          // if due datetime is valid
          if (now < value.due) {
            numKeys++;

            // Compose data to persist
            const data = {
              key: value.key,
              space: value.space,
              data: {
                value: value.value,
                created: value.created,
                updated: value.updated,
                due: value.due,
              },
            };

            // If web environment, adds data to lines array
            if (this.webEnv) lines.push(data);
            // NodeJS environment. File space
            else
              fs.appendFileSync(filename, `${JSON.stringify(data)}\n`, "utf8");
          } // if due valid datetime
        } // for values

        // If web environment, saves space and its keys/values into localstorage
        if (webEnv)
          localStorage.setItem(`efememdb_${space}`, JSON.stringify(lines));
      } // for spaces

      return {
        ok: true,
        cmd: "persist()",
        data: {},
        msg: `EFEMem DB has persisted the data. Total spaces: ${numSpaces}. Total keys: ${numKeys}`,
        affected: numKeys,
        time: finishTime(start),
      };
    } catch (error) {
      return {
        ok: false,
        cmd: "persist()",
        data: {},
        msg: `EFEMem DB cannot persist the data. Error: ${error}`,
        affected: 0,
        time: finishTime(start),
      };
    }
  } // function persist()

  /**
   * Restores the keys saved previously with persist()
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  restore() {
    const start = new Date();
    let numSpaces = 0;
    let numKeys = 0;
    let spaces = [];
    let filename = "";

    try {
      // If NodeJS environment, get spaces from index file
      if (!this.webEnv) {
        // Reads the index master file
        filename =
          this.config.dataPath != ""
            ? `${this.config.dataPath}${path.sep}efememdb.efs`
            : "efememdb.efs";

        // if index data exists
        if (fs.existsSync(filename)) {
          spaces = fs.readFileSync(filename, "utf8").split(",");
        }
      }
      // If Web environment, get spaces from localstorage index key
      else spaces = localStorage.getItem("efememdb-efs").split(",");

      // Reads each space data file
      for (const space of spaces) {
        // valid space (not empty)
        if (space != null && space != "") {
          numSpaces++;

          let keys = [];

          // If NodeJS environment, retrieve keys from space data file
          if (!this.webEnv) {
            filename =
              this.config.dataPath != ""
                ? `${this.config.dataPath}${path.sep}${space}.efd`
                : `${space}.efd`;

            keys = fs.readFileSync(filename, "utf8").split("\n");
          }
          // If Web environment, retrieve keys from localstorage space key
          else keys = JSON.parse(localStorage.getItem(`efememdb_${space}`));

          // Restore each key of the current space
          for (const key of keys) {
            // valid key
            if (key != null && key != "") {
              numKeys++;

              const data = !this.webEnv ? JSON.parse(key) : key;

              this.set(data.key, data.data.value, data.space);

              // Restore original datatime fields
              this.data[this.data.length - 1].due = data.data.due;
              this.data[this.data.length - 1].created = data.data.created;
              this.data[this.data.length - 1].updated = data.data.updated;
            } // valid key
          } // for key
        } // if valid space
      } // for space

      return {
        ok: true,
        cmd: "restore()",
        data: {},
        msg: `EFEMem DB has restored the data. Total spaces: ${numSpaces}. Total keys: ${numKeys}`,
        affected: numKeys,
        time: finishTime(start),
      };
    } catch (error) {
      return {
        ok: false,
        cmd: "restore()",
        data: {},
        msg: `EFEMem DB cannot restore data. Error: ${error}`,
        affected: 0,
        time: finishTime(start),
      };
    }
  } // function restore()
} // Efemem DB Class

/* Returns the approximate memory usage, in bytes, of the specified object. The
 * parameter is:
 *
 * object - the object whose size should be determined
 */

/**
 * Validates the name of an entity (space, key, etc.)
 * @param {string} entity => Entity name to validate
 * @param {int} length => Maximum length
 * @param {regexp} regexp => Regular expression
 * @returns {JSON} => {ok: true|false, msg='message'}
 */
const validateEntity = (entity, length, regexp) => {
  // Check if the entity is a string
  if (typeof entity != "string")
    return {
      ok: false,
      msg: `'${entity}' name must be a string`,
    };

  // Check if the entity length is correct
  if (entity.length > length)
    return {
      ok: false,
      msg: `'${entity}' name is longer than ${length} characters`,
    };

  // Chek if the first character is alphapbetical
  let regex = new RegExp(/^[a-zA-Z]/);

  if (!regex.test(entity))
    return {
      ok: false,
      msg: `'${entity}' name is incorrect. First character must be alphabetical`,
    };

  // Check regular expression validation
  if (regexp.test(entity))
    return {
      ok: false,
      msg: `'${entity}' name is incorrect. Please check the use of possible illegal special characters`,
    };

  // Validation is ok
  return {
    ok: true,
    msg: `'${entity}' name is correct`,
  };
}; // validateEntity() function

/**
 * Converts an UTC Date to Local Timezone Date
 * @param {date} UTCDate => Date
 * @returns {Date} => Date passed as parameter converted to UTC local time
 */
function UTCToLocalDate(UTCDate) {
  var newDate = new Date(
    UTCDate.getTime() + UTCDate.getTimezoneOffset() * 60 * 1000
  );

  var offset = UTCDate.getTimezoneOffset() / 60;
  var hours = UTCDate.getHours();

  newDate.setHours(hours - offset);

  return newDate;
} // UTCToLocalDate() function

/**
 * Gets the current time in local time zone
 * @returns {Date} => Current local time
 */
const getLocalNow = () => {
  return UTCToLocalDate(new Date());
};

/**
 * Gets the current time plus a given seconds
 * @param {int} seconds => Number of seconds to add to current time
 * @returns {Date} => Current time increased by seconds parameter
 */
const getDueTime = (seconds) => {
  if (seconds > 0)
    //return new Date(new Date().getTime() + (seconds * 1000)).toISOString();
    return new Date(getLocalNow().getTime() + seconds * 1000).toISOString();
  else return new Date("9999-12-31T23:59:59").toISOString();
}; // getDue() function

/**
 * Gets the difference between the moment passed as argument and current moment
 * @param {hrtime} startTime => Previous moment using process.hrtime
 * @returns {string} => Difference between startTime and current time (9s 9.999ms 9 nanosecons)
 */
const finishTime = (startTime) => {
  let diff = new Date() - startTime; // Difference in milliseconds

  if (diff < 1) return `< 1 ms`;
  else return `${diff} ms`;
}; // finishTime() function

/**
 * Gets the size of a value as native type (string, number or boolean)
 * @param {any} value => Value to be calculated
 * @returns {number} => Size of value. -1 if its type is not native
 */
const getNativeSize = (value) => {
  const valueType = typeof value;

  if (valueType == "string") return value.length * 2;

  if (valueType == "number") return 8;

  if (valueType == "boolean") return 4;

  return -1; // No native type
}; // getNativeSize() function

/**
 * Gets the size of any value
 * @param {any} value => Value to be measured
 * @returns {number} => Size of value in bytes
 */
const getValueSize = (value) => {
  let items = [value]; // decomponse the value
  let size = 0;

  // Iterate over the items of the value
  for (item of items) {
    // if item is string, number or boolean
    if (typeof item != "object") size += getNativeSize(item);
    else {
      // if item is an array or object

      // If item is an array, sums the length of the name of each one
      if (Object.prototype.toString.call(item) != "[object Array]")
        for (const key in item) size += key.length * 2;

      // process each item of the array or object
      for (const key in item) {
        let found = false;

        // Look for previous processed key
        for (element of items) {
          if (element === item[key]) {
            found = true;
            break;
          }
        } // element loop

        if (!found) items.push(item[key]);
      } // key loop
    } // else type object
  } // item loop

  return size;
}; // getValueSize() function

/**
 * Gets a random Key with a give size
 * @param {int} size => Size between 16 and 1000 characters
 * @returns {string} => Random key
 */
const getRandomKey = (size = 16) => {
  let result = "";

  if (size < 1 || size > 1000) size = 16; // minimum size

  for (let i = 0; i < size; i++) {
    let ascii = 31 + Math.floor(1 + Math.random() * 95);

    if (ascii == 34 || ascii == 92) ascii = 45;

    result += String.fromCharCode(ascii);
  }

  return result;
}; // getRandomKey() function

/**
 * Deletes the key and values located on a given index
 * @param {int} idx => Index of element to be deleted
 * @returns Nothing
 */
const deleteIndex = (idx) => {
  if (idx >= 0 && idx < efemem.spkeys.length) {
    delete efemem.spkeys[idx];
    efemem.spkeys = efemem.spkeys.filter((val) => {
      return val != null;
    });
    delete efemem.data[idx];
    efemem.data = efemem.data.filter((val) => {
      return val != null;
    });
  }
}; // function deleteIndex()

/**
 * Gets the key detail info from its index position
 * @param {int} index => Index position of the key
 * @returns {JSON} => {key, space, value, due, createdAt, updatedAt}
 */
const getKeyDetail = (index) => {
  if (index < 0 || index >= efemem.spkeys.length)
    return {
      key: "",
      value: {},
      space: "",
      due: "",
      createdAt: "",
      updatedAt: "",
    };

  const spaceKey = efemem.spkeys[index].split("@");

  return {
    key: spaceKey[1],
    space: spaceKey[0],
    value: efemem.data[index].value,
    due: efemem.data[index].due,
    created: efemem.data[index].created,
    updated: efemem.data[index].updated,
  };
}; // function getKeyDetail()

const efemem = new EFEMemDB();

// If NodeJS environment, export the efemem object
if (!webEnv) {
  module.exports = {
    efemem,
  };
}
