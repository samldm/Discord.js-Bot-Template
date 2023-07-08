const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const Client = require('../Client');

module.exports = {
    name: 'ping',
    builder: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!'),
    
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.reply('Pong!');
    }
}