const CommandManager = require("./CommandManager")


module.exports = class Manager
{
  constructor() {
    this.commands = new CommandManager();
  }
}