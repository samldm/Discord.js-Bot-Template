const AdvancedClient = require("../structure/Client");
const { Interaction } = require('discord.js');
const Logger = require("../utils/Logger");
module.exports = {
  name: "interactionCreate",
  /**
   * 
   * @param {AdvancedClient} client
   * @param {Interaction} interaction 
   */
  execute: (client, interaction) => {
    if (interaction.isCommand()) {
      let cmd = client.commands.get(interaction.commandName);
      if (!cmd || !cmd.execute) return;
      try {
        cmd.execute(client, interaction);
      } catch(e) {
        Logger.error(`An error occured while executing command '${interaction.commandName}'.`);
      }
    }
  }
}