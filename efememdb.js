/*
/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
efememdb.js

Easy, Fast and Effective MEMory DataBase
Version 1.0.0

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
const efememconf = require("./efememdb.json");
const utils = require("./efememutils");
const path = require("path");
const fs = require("fs");

const KEY_MAX_LENGTH = 100;
const SPACE_MAX_LENGTH = 24;

class EFEMemDB {
  constructor() {
    this.spkeys = [];
    this.data = [];
    this.config = {
      accessKey: efememconf.hasOwnProperty("accessKey")
        ? efememconf.accessKey
        : utils.getRandomKey(64),
      maxMemory: efememconf.hasOwnProperty("maxMemory")
        ? efememconf.maxMemory
        : 1048576,
      keysMax: efememconf.hasOwnProperty("keysMax") ? efememconf.keysMax : 1000,
      recyclingMode: efememconf.hasOwnProperty("recyclingMode")
        ? efememconf.recyclingMode
        : false,
      dataPath: efememconf.hasOwnProperty("dataPath")
        ? efememconf.dataPath
        : `.${path.sep}data`
    };

    this.restore();
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
    const start = process.hrtime();

    // Validations
    if (key == undefined || key == null)
      return {
        ok: false,
        cmd: "set()",
        data: {},
        msg: "Error on key: No key provided",
        affected: 0
      };

    if (value == undefined || key == null)
      return {
        ok: false,
        cmd: "set()",
        data: {},
        msg: "Error on value: No value provided",
        affected: 0
      };

    if (due == undefined || due == null) due = -1;

    if (isNaN(due))
      return {
        ok: false,
        cmd: "set()",
        data: {},
        msg: "Error on due: Must be a number",
        affected: 0
      };

    // Validate space name
    if (space == undefined || space == null || space == "") space = "public";

    let validation = utils.validateEntity(
      space,
      SPACE_MAX_LENGTH,
      new RegExp(/[^0-9a-zA-Z]+/g)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "set()",
        data: value,
        msg: `Error on space: ${validation.msg}`,
        affected: 0
      };

    // Validate key name
    validation = utils.validateEntity(
      key,
      KEY_MAX_LENGTH,
      new RegExp(/[^0-9a-zA-Z|#:_.]+/g)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "set()",
        data: value,
        msg: `Error on key: ${validation.msg}`,
        affected: 0
      };

    // Compose real key (space@key) and data
    const realKey = `${space}@${key}`;

    //const now = new Date().toISOString();
    const now = utils.getLocalNow();
    const dueTime = utils.getDueTime(due);

    const data = {
      //key: key,
      //space: space,
      value: value,
      due: dueTime,
      updated: now
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
          affected: 0
        };

      // If maximum number of keys has been reached
      if (this.spkeys.length >= this.config.keysMax)
        if (!this.config.recyclingMode)
          // if not recycling mode dont's save ky
          return {
            ok: false,
            cmd: "set()",
            data: value,
            msg: `Key '${key}' cannot be saved. Maximum number of keys (${this.config.keysMax}) has been reached`,
            affected: 0
          };
        // else recycling mode, deletes the first key
        else this.deleteIndex(0);

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
      time: utils.finishTime(start)
    };
  } // function set()

  /**
   * Get the list of keys based on a pattern and/or space
   * @param {string} key => Optional. Pattern of the name of key
   * @param {string} space => Optional. Pattern of the name of space
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: [key_names], msg: 'message', affected: number, time: 'execution_time' }
   */
  keys(key, space) {
    const start = process.hrtime();

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
      time: utils.finishTime(start)
    };
  } // function keys()

  /**
   * Get the list of spaces used currently
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: [space_names]], msg: 'message', affected: number, time: 'execution_time' }
   */
  spaces() {
    const start = process.hrtime();

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
        time: utils.finishTime(start)
      };
    else
      return {
        ok: true,
        cmd: "spaces()",
        data: {},
        msg: `No space used`,
        affected: 0,
        time: utils.finishTime(start)
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
        msg: "Error: No key provided"
      };

    let validation = utils.validateEntity(
      key,
      KEY_MAX_LENGTH,
      new RegExp(/[^0-9a-zA-Z|#:_.]+/g)
    );

    if (!validation.ok)
      return {
        ok: false,
        msg: `Error on key: ${validation.msg}`
      };

    validation = utils.validateEntity(
      space,
      SPACE_MAX_LENGTH,
      new RegExp(/[^0-9a-zA-Z]+/g)
    );

    if (!validation.ok)
      return {
        ok: false,
        msg: `Error on space: ${validation.msg}`
      };

    const realKey = `${space}@${key}`;

    const idx = this.spkeys.indexOf(realKey);

    if (idx < 0)
      return {
        ok: false,
        msg: `Error: key '${key}' in space '${space}' not found`
      };

    return {
      ok: true,
      msg: `Key '${key}' in space '${space}' found`,
      pos: idx
    };
  } // function check()

  /**
   * Gets the value for a given key
   * @param {string} key => Key name
   * @param {string} space => Optional. Space name ('public' by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  get(key, space = "public") {
    const start = process.hrtime();
    const checked = this.check(key, space);

    if (!checked.ok)
      return {
        ok: false,
        cmd: "get()",
        data: {},
        msg: checked.msg,
        affected: 0
      };

    const now = utils.getLocalNow().toISOString();

    // If due time is over
    if (this.data[checked.pos].due < now) {
      this.deleteIndex(checked.pos); // delete key

      return {
        ok: true,
        cmd: "get()",
        data: {},
        msg: `Key '${key == undefined || key == null ? "*" : key}' in space '${
          space == undefined || space == null ? "*" : space
        }' not found`,
        affected: 0
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
      time: utils.finishTime(start)
    };
  } // function get()

  /**
   * Get the list of values based on a pattern and/or space
   * @param {string} key => Optional. Pattern of the name of key
   * @param {string} space => Optional. Pattern of the name of space
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: [{values}], msg: 'message', affected: number, time: 'execution_time' }
   */
  values(key, space) {
    const start = process.hrtime();

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
            value: value.data.value
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
        time: utils.finishTime(start)
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
      time: utils.finishTime(start)
    };
  } // function values()

  /**
   * Deletes the value of a given key
   * @param {string} key => Key to be deleted
   * @param {string} space => Optional. Space name ('public' by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {deleted_value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  delete(key, space = "public") {
    const start = process.hrtime();
    const checked = this.check(key, space);

    if (!checked.ok)
      return {
        ok: false,
        cmd: "delete()",
        data: {},
        msg: checked.msg,
        affected: 0,
        time: utils.finishTime(start)
      };

    const data = this.getKeyDetail(checked.pos);

    this.deleteIndex(checked.pos);

    return {
      ok: true,
      cmd: "delete()",
      ...data,
      msg: `Key '${key}' in space '${space}' deleted successfully`,
      affected: 1,
      time: utils.finishTime(start)
    };
  } // function delete()

  /**
   * Deletes the key and values located on a given index
   * @param {int} idx => Index of element to be deleted
   * @returns Nothing
   */
  deleteIndex(idx) {
    if (idx >= 0 && idx < this.spkeys.length) {
      delete this.spkeys[idx];
      this.spkeys = this.spkeys.filter(val => {
        return val != null;
      });
      delete this.data[idx];
      this.data = this.data.filter(val => {
        return val != null;
      });
    }
  } // function deleteIndex()

  /**
   * Renames a given key
   * @param {string} key => Current key name
   * @param {string} newKey => New key name
   * @param {string} space => Space name ('public' by default)
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  rename(key, newKey, space = "public") {
    const start = process.hrtime();
    const checked = this.check(key, space);

    if (!checked.ok)
      return {
        ok: false,
        cmd: "rename()",
        data: {},
        msg: checked.msg,
        affected: 0,
        time: utils.finishTime(start)
      };

    if (newKey == undefined || newKey == null || newKey == "")
      return {
        ok: false,
        cmd: "rename()",
        data: {},
        msg: "Error: No new key provided",
        affected: 0,
        time: utils.finishTime(start)
      };

    let validation = utils.validateEntity(
      newKey,
      KEY_MAX_LENGTH,
      new RegExp(/[^0-9a-zA-Z|#:_.]+/g)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "rename()",
        data: {},
        msg: `Error on new key: ${validation.msg}`,
        affected: 0,
        time: utils.finishTime(start)
      };

    // Change key name
    this.spkeys[checked.pos] = `${space}@${newKey}`;

    return {
      ok: true,
      cmd: "rename()",
      data: this.data[checked.pos].value,
      msg: `Key '${key}' at space '${space}' was renamed as '${newKey}'`,
      affected: 1,
      time: utils.finishTime(start)
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
    const start = process.hrtime();

    if (space == undefined || space == null || space == "") space = "public";

    const checked = this.check(key, space);

    if (!checked.ok)
      return {
        ok: false,
        cmd: "move()",
        data: {},
        msg: checked.msg,
        affected: 0,
        time: utils.finishTime(start)
      };

    let validation = utils.validateEntity(
      newSpace,
      SPACE_MAX_LENGTH,
      new RegExp(/[^0-9a-zA-Z]+/g)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "move()",
        data: {},
        msg: `Error on new space: ${validation.msg}`,
        affected: 0,
        time: utils.finishTime(start)
      };

    // Change key name
    this.spkeys[checked.pos] = `${newSpace}@${key}`;

    return {
      ok: true,
      cmd: "move()",
      data: this.data[checked.pos].value,
      msg: `Key '${key}' at space '${space}' was moved to space '${newSpace}'`,
      affected: 1,
      time: utils.finishTime(start)
    };
  } // function move()

  /**
   * Get statistics about the use of EFEMem DB
   */
  stats() {
    const start = process.hrtime();

    // Get spaces
    const spaces = this.spaces();

    // Prepare data
    let keySize = 0;
    let dataSize = 0;
    let dbSize = 0;

    let result = {
      totalSpaces: spaces.data.length,
      totalKeys: this.spkeys.length,
      time: "",
      keySize: 0,
      dataSize: 0,
      dbSize: 0,
      totalSize: 0,
      spaces: []
    };

    // For each space name
    for (const space of spaces.data) {
      // Get keys for the current space
      const keys = this.keys("*", space);

      // Counters
      let vsize = 0;
      let dsize = 0;
      let ksize = 0;

      // For each key
      for (const key of keys.data) {
        // Get value
        const value = this.get(key.key, space);

        // update the size on counters
        ksize += utils.getValueSize(key);
        vsize += utils.getValueSize(value.data.value);
        dsize += utils.getValueSize(value.data);
      }

      keySize += ksize;
      dataSize += vsize;
      dbSize += dsize;

      // Space statistics
      result.spaces.push({
        spaceName: space,
        spaceKeys: keys.data.length,
        spaceKeySize: ksize,
        spaceDataSize: vsize,
        spaceDBSize: dsize - vsize,
        spaceTotalSize: ksize + vsize + (dsize - vsize)
      });
    } // for()

    // General statistics
    result.keySize = keySize;
    result.dataSize = dataSize;
    result.dbSize = dbSize - dataSize;
    result.totalSize = result.keySize + result.dataSize + result.dbSize;
    result.time = utils.finishTime(start);

    return result;
  } // function stats()

  /**
   * Gets the key detail info from its index position
   * @param {int} index => Index position of the key
   * @returns {JSON} => {key, space, value, due, createdAt, updatedAt}
   */
  getKeyDetail(index) {
    if (index < 0 || index >= this.spkeys.length)
      return {
        key: "",
        value: {},
        space: "",
        due: "",
        createdAt: "",
        updatedAt: ""
      };

    const spaceKey = this.spkeys[index].split("@");

    return {
      key: spaceKey[1],
      space: spaceKey[0],
      value: this.data[index].value,
      due: this.data[index].due,
      created: this.data[index].created,
      updated: this.data[index].updated
    };
  } // function getKeyDetail()

  /**
   * Gets the size used: key size + value size + db size
   */
  memory() {
    let size = 0;

    for (const item of this.spkeys) size += utils.getValueSize(item);

    for (const item of this.data) size += utils.getValueSize(item);

    return {
      maxMemory: this.config.maxMemory,
      usedMemory: size,
      freeMemory: this.config.maxMemory - size
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
        affected: 0
      };

    if (!this.config.hasOwnProperty(param))
      return {
        ok: false,
        cmd: "getConfig()",
        data: {},
        msg: `EFEMem DB configuration parameter name '${param}' not found`,
        affected: 0
      };

    return {
      ok: true,
      cmd: "getConfig()",
      data: this.config[param],
      msg: `EFEMem DB configuration parameter name '${param}' found`,
      affected: 1
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
        affected: 0
      };

    let validation = utils.validateEntity(
      param,
      SPACE_MAX_LENGTH,
      new RegExp(/[^0-9a-zA-Z]+/g)
    );

    if (!validation.ok)
      return {
        ok: false,
        cmd: "setConfig()",
        data: value,
        msg: `Error on configuration parameter: ${validation.msg}`,
        affected: 0
      };

    if (value == undefined || value == null)
      return {
        ok: false,
        cmd: "setConfig()",
        data: {},
        msg: `No configuration value provided for parameter '${param}'`,
        affected: 0
      };

    try {
      this.config[param] = value;

      return {
        ok: true,
        cmd: "setConfig()",
        data: value,
        msg: `EFEMem DB configuration parameter '${param}' was assigned with value '${value}'`,
        affected: 1
      };
    } catch (error) {
      return {
        ok: false,
        cmd: "setConfig()",
        data: {},
        msg: `Error on configuration setting parameter '${param}' with value '${value}': '${error}'`,
        affected: 0
      };
    } // catch()
  } // function setConfig()

  /**
   * Save all data to files, into the path defined on 'dataPath' configuration parameter
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  persist() {
    const start = process.hrtime();
    let numSpaces = 0;
    let numKeys = 0;

    // Generate the file master, which contains all the spaces. Each space is a database file
    const spaces = this.spaces();
    let filename = `${this.config.dataPath}${path.sep}efememdb.idb`;

    if (fs.existsSync(filename)) fs.unlinkSync(filename);

    for (const space of spaces.data) {
      try {
        const rdbFile = `${this.config.dataPath}${path.sep}${space}.data`;
        if (fs.existsSync(rdbFile)) fs.unlinkSync(rdbFile);

        fs.appendFileSync(filename, `${space}\n`, "utf8");
        numSpaces++;
      } catch (error) {
        console.log(error);
      }
    }

    const max = this.spkeys.length;

    // Loop each key
    for (let i = 0; i < max; i++) {
      const now = utils.getLocalNow().toISOString();

      // If key time is not due
      if (this.data[i].due > now) {
        const sk = this.spkeys[i].split("@");
        filename = `${this.config.dataPath}${path.sep}${sk[0]}.data`;
        const data = {
          key: sk[1],
          space: sk[0],
          data: this.data[i]
        };

        const line = JSON.stringify(data) + "\n";

        try {
          fs.appendFileSync(filename, line, "utf8");
          numKeys++;
        } catch (error) {
          console.log(error);
        }
      } // else valid key
    } // for

    return {
      ok: true,
      cmd: "persist()",
      data: {},
      msg: `EFEMem DB has persisted the data. Total spaces: ${numSpaces}. Total keys: ${numKeys}`,
      affected: numKeys,
      time: utils.finishTime(start)
    };
  } // function persist()

  /**
   * Restores the keys saved previously with persist()
   * @returns {JSON} => { ok: true|false, cmd: 'command', data: {value}, msg: 'message', affected: number, time: 'execution_time' }
   */
  restore() {
    const start = process.hrtime();
    let numSpaces = 0;
    let numKeys = 0;

    // Reads the index master file
    let filename = `${this.config.dataPath}${path.sep}efememdb.idb`;

    if (fs.existsSync(filename)) {
      // if index data exists

      const idxSpaces = fs.readFileSync(filename, "utf8").split("\n");
      console.log(idxSpaces[0]);

      // Reads each space database
      for (const space of idxSpaces) {
        // valid space (not empty)
        if (space != null && space != "") {
          numSpaces++;

          filename = `${this.config.dataPath}${path.sep}${space}.data`;

          const keys = fs.readFileSync(filename, "utf8").split("\n");
          // Restore each key of the current space
          for (const key of keys) {
            // valid key
            if (key != null && key != "") {
              numKeys++;
              const data = JSON.parse(key);
              this.set(data.key, data.data, data.space);
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
        time: utils.finishTime(start)
      };
    } // if index file data exists
    else
      return {
        ok: true,
        cmd: "restore()",
        data: {},
        msg: `EFEMem DB cannot restore data. No persisted data found`,
        affected: 0,
        time: utils.finishTime(start)
      };
  } // function restore()
} // Efemem DB Class

const efemem = new EFEMemDB();

module.exports = {
  efemem
};
