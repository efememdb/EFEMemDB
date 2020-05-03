/*
/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
efememdb.js

Easy, Fast and Efficient MEMory NoSQL DataBase
Version 1.0.8

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
const KEY_MIN_LENGTH = 3;
const KEY_MAX_LENGTH = 100;
const SPACE_MAX_LENGTH = 24;
const ENTITY_SPACE = 1;
const ENTITY_KEY = 2;
const VALID_KEY = new RegExp(/[^0-9a-zA-Z|#:_.]+/g);
const VALID_SPACE = new RegExp(/[^0-9a-zA-Z]+/g);

// EFEMemDB class
// Properties:
//   - spkeys[] => space~key array. Contains all spaces and keys
//   - data[]   => Array with all values
//   - version  => EFEMem DB version
//   - config   => Configuration
//
// Methods:
//   - constructor()
//   - info()
//   - set()
//   - keys()
//   - spaces()
//   - get()
//   - delete()
//   - rename()
//   - move()
//   - copy()
//   - stats()
//   - memory()
//   - getConfig()
//   - setConfig()
//   - persist()
//   - restore()
//
class EFEMemDB {
  constructor() {
    this.spkeys = [];
    this.data = [];
    this.version = `1.0.8`;
    this.webEnv = webEnv;
    this.config = {
      accessKey: efememconf.hasOwnProperty("accessKey")
        ? efememconf.accessKey
        : getRandomKey(64),
      maxMemory: efememconf.hasOwnProperty("maxMemory")
        ? efememconf.maxMemory
        : 10240,
      maxKeys: efememconf.hasOwnProperty("maxKeys") ? efememconf.maxKeys : 1000,
      recyclingMode: efememconf.hasOwnProperty("recyclingMode")
        ? efememconf.recyclingMode
        : false,
      dataPath: efememconf.hasOwnProperty("dataPath")
        ? efememconf.dataPath
        : "",
    };
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
    const cmd = "set(key, value[,space[,due]])";

    try {
      // Validations
      if (key == undefined || key == null || key.length < KEY_MIN_LENGTH)
        key = getHash();

      if (value == undefined || key == null)
        return { ok: false, cmd: cmd, msg: "Error: No 'value' provided" };

      if (due == undefined || due == null) due = -1;

      if (isNaN(due))
        return { ok: false, cmd: cmd, msg: "Error: 'due' must be a number" };

      // Validate space name
      if (space == undefined || space == null || space == "") space = "public";

      let valid = validate(ENTITY_SPACE, space);

      if (!valid.ok)
        return { ok: false, cmd: cmd, msg: `Error on space: ${valid.msg}` };

      // Validate key name
      valid = validate(ENTITY_KEY, key);

      if (!valid.ok)
        return { ok: false, cmd: cmd, msg: `Error on key: ${valid.msg}` };

      // Compose real key (space~key) and data
      const realKey = `${space}~${key}`;

      const now = getLocalNow();
      const dueTime = getDueTime(due);

      const data = { value: value, due: dueTime };

      let idx = this.spkeys.indexOf(realKey);

      // If not exists previously, add it
      if (idx < 0) {
        const mem = this.memory().usedMemory;

        // if maximum memory has been reached
        if (mem > this.config.maxMemory)
          return {
            ok: false,
            cmd: cmd,
            msg: `Error: Max memory reached (${mem} of ${this.config.maxMemory} bytes)`,
          };

        // If maximum number of keys has been reached
        if (this.spkeys.length >= this.config.maxKeys)
          if (!this.config.recyclingMode)
            // if not recycling mode dont's save key
            return {
              ok: false,
              cmd: cmd,
              msg: `Error: ${this.config.maxKeys} keys reached`,
            };
          // else recycling mode, deletes the first (oldest) key
          else deleteIndex(0);

        this.spkeys.push(realKey);
        this.data.push(data);
      } else {
        // If exists overwrite it
        this.spkeys[idx] = realKey;
        this.data[idx] = data;
      }

      return {
        ok: true,
        cmd: cmd,
        data: { key: key, space: space, ...data },
        msg: `Key '${key}' saved successfully in space '${space}'`,
        affected: 1,
        time: finishTime(start),
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: ${error}` };
    }
  } // function set()

  /**
   * Get the list of keys based on a pattern and/or space
   * @param {string} key => Optional. Pattern of the name of key
   * @param {string} space => Optional. Pattern of the name of space
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: [key_names], msg: 'message', affected: number, time: 'execution_time' }
   */
  keys(key, space) {
    const start = new Date();
    const cmd = "keys([key[,space]])";
    let result = [];
    const idxs = keysIndexes(key, space);

    idxs.forEach((idx) => {
      const [ispace, ikey] = this.spkeys[idx].split("~");
      result.push({ space: ispace, key: ikey });
    });

    return {
      ok: true,
      cmd: cmd,
      data: result,
      msg: `${result.length} Keys retrieved`,
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
    const cmd = "spaces()";

    try {
      let spaces = [];

      for (const item of this.spkeys) {
        const space = item.split("~")[0];

        if (spaces.indexOf(space) < 0) spaces.push(space);
      }

      return {
        ok: true,
        cmd: cmd,
        data: spaces.sort(),
        msg: `${spaces.length} spaces used`,
        affected: spaces.length,
        time: finishTime(start),
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: ${error}` };
    }
  } // function spaces()

  /**
   * Gets the value for a given key
   * @param {string} key => Key name
   * @param {string} space => Optional. Space name ('public' by default)
   * @param {boolean} fullInfo => true if get full information (false by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  get(key, space, fullInfo = false) {
    const start = new Date();
    const cmd = "get(key[,space])";
    const now = getLocalNow().toISOString();
    let result = [];
    let del = 0;

    try {
      const idxs = keysIndexes(key, space);

      idxs.forEach((idx) => {
        // Mark the key for deletion if due
        if (this.data[idx].due < now) {
          del++;
          markForDelete(idx);
        }

        const [ispace, ikey] = this.spkeys[idx].split("~");

        if (fullInfo)
          result.push({
            space: ispace,
            key: ikey,
            value: this.data[idx].value,
            due: this.data[idx].due,
          });
        else
          result.push({
            key: this.spkeys[idx],
            value: this.data[idx].value,
          });
      });

      if (del > 0) deleteMarked();

      return {
        ok: true,
        cmd: cmd,
        data: result,
        msg: `${idxs.length} values found`,
        affected: idxs.length,
        time: finishTime(start),
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: ${error}` };
    }
  } // function get()

  /**
   * Deletes the value of a given key
   * @param {string} key => Key to be deleted
   * @param {string} space => Optional. Space name ('public' by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {deleted_value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  delete(key, space = "public") {
    const start = new Date();
    const cmd = "delete(key[,space])";

    try {
      const idxs = keysIndexes(key, space);

      idxs.forEach((idx) => {
        markForDeletion(idx);
      });

      deleteMarked();

      return {
        ok: true,
        cmd: cmd,
        data: { key: key, space: space },
        msg: `${idxs.length} keys deleted`,
        affected: 1,
        time: finishTime(start),
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: ${error}` };
    }
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
    const cmd = "rename(key, newKey[, space])";

    // Validate new key
    if (newKey == undefined || newKey == null || newKey.length < KEY_MIN_LENGTH)
      return { ok: false, cmd, msg: `Error: new key '${newKey}' is not valid` };

    let valid = validate(ENTITY_KEY, newKey);

    if (!valid.ok)
      return { ok: false, cmd: cmd, msg: `Error on new key: ${valid.msg}` };

    try {
      let idxs = keysIndexes(key, space);

      if (idxs.length == 0)
        return { ok: false, cmd, msg: `Error: key '${key}' not found` };

      if (idxs.length > 1)
        return { ok: false, cmd, msg: `Error: key '${key}' is not unique` };

      // Change key name
      this.spkeys[idxs[0]] = `${space}~${newKey}`;

      return {
        ok: true,
        cmd: cmd,
        data: this.data[idxs[0]].value,
        msg: `Key '${key}' at space '${space}' was renamed as '${newKey}'`,
        affected: 1,
        time: finishTime(start),
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: ${error}` };
    }
  } // function rename()

  /**
   * Moves keys from a given space (base on a key pattern) to another space
   * @param {string} key => Key name
   * @param {string} space => Space name (origin. all spaces as default)
   * @param {string} newSpace  => New space name (destination. 'public' as default)
   * @param {boolean} overwrite => Optional. If true, when destination key exists overwrite it (false, by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  move(key, space, newSpace, overwrite = false) {
    const start = new Date();
    const cmd = "move(key, space[,newSpace[,overwrite]])";
    let del = 0;
    let kept = 0;

    try {
      // Validate destination space
      if (newSpace == undefined || newSpace == null || newSpace == "")
        newSpace = "public";

      let valid = validate(ENTITY_SPACE, newSpace);

      if (!valid.ok)
        return { ok: false, cmd: cmd, msg: `Error on new space: ${valid.msg}` };

      const idxs = keysIndexes(key, space);

      if (idxs.length == 0)
        return { ok: false, cmd: cmd, msg: `Error: Key '${key}' not found` };

      idxs.forEach((idx) => {
        const spKey = `${newSpace}~${this.spkeys[idx].split("~")[1]}`;

        // Checks if destination already in use
        const prev = this.spkeys.indexOf(spKey);

        // if not previous existing destination key
        if (prev < 0) this.spkeys[idx] = `${spKey}`;
        else if (prev >= 0 && overwrite) {
          // only if overwrite == true
          del++;
          markForDeletion(prev);
          this.spkeys[idx] = `${spKey}`;
        } else kept++;
      }); // forEach()

      // if old spaces were marked for deletion
      if (del > 0) deleteMarked();

      return {
        ok: true,
        cmd: cmd,
        data: { key: key, space: space, overwrite: overwrite },
        msg: `${idxs.length - kept} of ${
          idxs.length
        } Keys moved to '${newSpace}'`,
        affected: idxs.length - kept,
        time: finishTime(start),
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: ${error}` };
    }
  } // function move()

  /**
   * Copies a pattern key from a given space to another space
   * @param {string} key => Key name
   * @param {string} space => Space name (origin)
   * @param {string} newSpace  => New space name (destination. 'public' as default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  copy(key, space, newSpace) {
    const start = new Date();
    const cmd = "copy(key, space[,newSpace])";

    try {
      // Validate destination space
      if (newSpace == undefined || newSpace == null || newSpace == "")
        newSpace = "public";

      let valid = validate(ENTITY_SPACE, newSpace);

      if (!valid.ok)
        return { ok: false, cmd: cmd, msg: `Error on new space: ${valid.msg}` };

      const idxs = keysIndexes(key, space);

      if (idxs.length == 0)
        return { ok: false, cmd: cmd, msg: `Error: Key '${key}' not found` };

      idxs.forEach((idx) => {
        const [ispace, ikey] = this.spkeys[idx].split("~");
        const spKey = `${newSpace}~${ikey}`;

        // Checks if destination already in use
        const prev = this.spkeys.indexOf(spKey);

        // if not previous existing destination key
        if (prev < 0) {
          this.set(ikey, this.data[idx].value, newSpace);
          this.data[this.data.length - 1].due = this.data[idx].due;
        } else {
          this.data[prev].value = this.data[idx].value;
          this.data[prev].due = this.data[idx].due;
        }
      }); // forEach()

      return {
        ok: true,
        cmd: cmd,
        data: { key: key, space: space },
        msg: `${idxs.length} Keys copied to '${newSpace}'`,
        affected: idxs.length,
        time: finishTime(start),
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: ${error}` };
    }
  } // function copy()

  /**
   *  Calculates some statistics operations over the keys matched with the patterns passed as parameters
   * @param {string} key => Optional. Pattern of the name of key (all by default)
   * @param {string} space => Optional. Pattern of the name of space (all by default)
   */
  stats(key, space) {
    const start = new Date();

    try {
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
        const spkey = item.split("~");
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
        cmd: "stats([key[,space]])",
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
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: ${error}` };
    }
  }

  /**
   * Get statistics about an space
   */
  spaceInfo(space = "public") {
    const start = new Date();
    const cmd = "spaceInfo([space])";

    try {
      // Get spaces
      const spaces = this.spaces();

      if (spaces.data.indexOf(space) < 0)
        return {
          ok: false,
          cmd: cmd,
          msg: `Error: Space '${space}' not found`,
        };

      // Prepare data
      let valuesSize = 0;
      let spaceSize = 0;
      let numKeys = 0;

      // Get keys for the current space
      const values = this.get("*", space);

      // For each key
      for (const value of values.data) {
        numKeys++;
        valuesSize += getValueSize(value.value);
        spaceSize +=
          getValueSize(value.due) +
          getValueSize(value.key) +
          getValueSize(value.space) +
          1;
      }

      return {
        ok: true,
        cmd: cmd,
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
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: ${error}` };
    }
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
    const cmd = "getConfig(param)";

    if (param == undefined || param == null || param == "" || param == "*")
      return {
        ok: true,
        cmd: cmd,
        data: this.config,
        msg: `Config parameters were found`,
        affected: this.config.length,
      };

    if (!this.config.hasOwnProperty(param))
      return { ok: false, cmd: cmd, msg: `Config param '${param}' not found` };

    return {
      ok: true,
      cmd: cmd,
      data: this.config[param],
      msg: `Config parameter '${param}' found`,
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
    const cmd = "setConfig(param, value)";

    if (param == undefined || param == null)
      return { ok: false, cmd: cmd, msg: `No config param provided` };

    let valid = validate(ENTITY_SPACE, param);

    if (!valid.ok)
      return { ok: false, cmd: cmd, msg: `Not valid param: ${valid.msg}` };

    if (value == undefined || value == null)
      return { ok: false, cmd: cmd, msg: `No value provided for '${param}'` };

    try {
      this.config[param] = value;

      return {
        ok: true,
        cmd: cmd,
        data: value,
        msg: `EFEMem DB configuration parameter '${param}' was assigned with value '${value}'`,
        affected: 1,
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error: '${error}'` };
    } // catch()
  } // function setConfig()

  /**
   * Save physically all data into files (nodeJS environment) or into localStorage (web environment)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  persist() {
    const start = new Date();
    const cmd = "persist()";
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
        const values = this.get("", space, true);

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
        cmd: cmd,
        data: {},
        msg: `EFEMem DB has persisted the data. Total spaces: ${numSpaces}. Total keys: ${numKeys}`,
        affected: numKeys,
        time: finishTime(start),
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error persisting data: ${error}` };
    }
  } // function persist()

  /**
   * Restores the keys saved previously with persist()
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  restore() {
    const start = new Date();
    const cmd = "restore()";
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
            } // valid key
          } // for key
        } // if valid space
      } // for space

      return {
        ok: true,
        cmd: cmd,
        data: {},
        msg: `EFEMem DB has restored the data. Total spaces: ${numSpaces}. Total keys: ${numKeys}`,
        affected: numKeys,
        time: finishTime(start),
      };
    } catch (error) {
      return { ok: false, cmd: cmd, msg: `Error restoring data: ${error}` };
    }
  } // function restore()
} // Efemem DB Class

/**
 * Validates a given entity (generic)
 * @param {int} type => Type of entity: 1=space, 2=key
 * @param {string} entity => Entity name to validate
 * @returns {JSON} => {ok: true|false, msg='message'}
 */
const validate = (type, entity) => {
  if (type == ENTITY_SPACE)
    return validateEntity(entity, SPACE_MAX_LENGTH, VALID_SPACE);
  else return validateEntity(entity, KEY_MAX_LENGTH, VALID_KEY);
}; // validate() function

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
    return { ok: false, msg: `'${entity}' name must be a string` };

  // Check if the entity length is correct
  if (entity.length > length)
    return { ok: false, msg: `'${entity}' name length > ${length} characters` };

  // Chek if the first character is alphapbetical
  let regex = new RegExp(/^[a-zA-Z]/);

  if (!regex.test(entity))
    return {
      ok: false,
      msg: `'${entity}' incorrect. First character must be alphabetical`,
    };

  // Check regular expression validation
  if (regexp.test(entity))
    return {
      ok: false,
      msg: `'${entity}' incorrect. Possible illegal special characters`,
    };

  // Validation is ok
  return { ok: true, msg: `'${entity}' name is correct` };
}; // validateEntity() function

/**
 * Get an array with indexes corresponding to keys based on a pattern and/or space
 * @param {string} key => Optional. Pattern of the name of key
 * @param {string} space => Optional. Pattern of the name of space
 * @returns {array} => Array with the list of the indexes
 */
const keysIndexes = (key, space) => {
  let indexes = [];

  try {
    if (key === undefined || key === null || key === "*") key = "";

    if (space === undefined || space === null || space === "*") space = "";

    efemem.spkeys.forEach((item, idx) => {
      const [ispace, ikey] = item.split("~");

      // No space (any space)
      if (space === "") {
        if (key === "") indexes.push(idx);
        else if (ikey.indexOf(key) >= 0) indexes.push(idx);
        // else if space coincidence
      } else if (ispace.indexOf(space) >= 0) {
        if (key === "") indexes.push(idx);
        else if (ikey.indexOf(key) >= 0) indexes.push(idx);
      }
    }); // forEach()
  } catch (error) {
    console.log(error);
  }

  return indexes;
}; // function keysIndexes()

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
 * Marks for deletion the key and values located on a given index
 * @param {int} idx => Index of element to be marked for deletion
 * @returns Nothing
 */
const markForDeletion = (idx) => {
  delete efemem.spkeys[idx];
  delete efemem.data[idx];
};

/**
 * Deletes phisically the keys marked for deletion
 */
const deleteMarked = () => {
  efemem.spkeys = efemem.spkeys.filter((val) => val != null);
  efemem.data = efemem.data.filter((val) => val != null);
};

/**
 * Deletes the key and values located on a given index
 * @param {int} idx => Index of element to be deleted
 * @returns Nothing
 */
const deleteIndex = (idx) => {
  if (idx >= 0 && idx < efemem.spkeys.length) {
    markForDeletion(idx);
    deleteMarked();
    /*delete efemem.spkeys[idx];
    efemem.spkeys = efemem.spkeys.filter((val) => {
      return val != null;
    });
    delete efemem.data[idx];
    efemem.data = efemem.data.filter((val) => {
      return val != null;
    });*/
  }
  console.log("");
}; // function deleteIndex()

/**
 * Gets the key detail info from its index position
 * @param {int} index => Index position of the key
 * @returns {JSON} => {key, space, value, due}
 */
const getKeyDetail = (index) => {
  if (index < 0 || index >= efemem.spkeys.length)
    return {
      key: "",
      value: {},
      space: "",
      due: "",
    };

  const spaceKey = efemem.spkeys[index].split("~");

  return {
    key: spaceKey[1],
    space: spaceKey[0],
    value: efemem.data[index].value,
    due: efemem.data[index].due,
  };
}; // function getKeyDetail()

/**
 * Generate a new hash key (18 hexadecimal characters)
 */
const getHash = () => {
  const now = new Date();
  const year = fillData(now.getFullYear().toString(16), 4, "0");
  const month = fillData((now.getMonth() + 1).toString(16), 2, "0");
  const day = fillData(now.getDate().toString(16), 2, "0");
  const hour = fillData(now.getHours().toString(16), 2, "0");
  const minute = fillData(now.getMinutes().toString(16), 2, "0");
  const second = fillData(now.getSeconds().toString(16), 2, "0");
  const milli = fillData(now.getMilliseconds().toString(16), 4, "0");
  const rand = fillData(
    Math.floor(1 + Math.random() * 4094).toString(16),
    3,
    "0"
  );

  return `EFE${year}${month}${day}${hour}${minute}${second}${milli}${rand}`.toUpperCase();
}; // getHash() function

/**
 * Fills a string with a given digit until a given number of characters
 * @param {string} data => Original data to be filled
 * @param {int} length => Final length
 * @param {char} digit => Character used to fill
 * @param {int} direction => 0=Left, 1=right
 * @returns {string} => String filled with digits
 */
const fillData = (data, length, digit, direction = 0) => {
  if (digit.length != 1) return data;

  const max = data.length;
  const dif = length - max;
  let result = data;

  if (max < length) {
    for (var i = 0; i < dif; i++) {
      if (direction == 0) result = `${digit}${result}`;
      else result = `${result}${digit}`;
    }
  }
  return result;
}; // fillData

const efemem = new EFEMemDB();

// If NodeJS environment, export the efemem object
if (!webEnv) module.exports = { efemem };
