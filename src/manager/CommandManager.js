const Logger = require('../utils/Logger');
const fs = require('fs');
const path = require('path');

const { SlashCommandBuilder } = require('discord.js');

module.exports = class CommandManager
{
  constructor() {
    this.data = new Map();
    this.config = require('../../config/managerConfig.js').commandManager;
  }

  async fetchAll() {
    let data_path = path.resolve(__dirname, "../data", this.config.data_path.commands);
    Logger.log("Fetching commands.");
    try {
      let commands = await fs.readdirSync(data_path);
      commands.forEach((file) => {
        if (!file.endsWith(".json")) return;
        let cmd = require(path.resolve(data_path, file));
        if (!cmd.name) return;
        this.data.set(cmd.name, cmd);
      });
    } catch(e) {
      Logger.error(`Error: Writing command data failed\n${e}`);
    }
    return this;
  }

  /**
   * Create a command
   * Will be saved in data folder. See ./config/managerConfig file.
   * @param {SlashCommandBuilder} builder Builder
   */
  async create(builder) {
    const data = builder.toJSON();
    let name = data.name;
    let filePath = path.resolve(__dirname, "../data", this.config.data_path.commands, `${name}.json`);

    Logger.log(`Writing data for '${name}' command.`);
    try {
      let buf = new Buffer.from(JSON.stringify(data));
      await fs.writeFileSync(filePath, buf, { encoding: 'utf-8' });
    } catch(e) {
      Logger.error(`Error: Writing command data failed\n${e}`);
    }
    
  }
}