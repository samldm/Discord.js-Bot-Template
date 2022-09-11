const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const Client = require('../structure/Client');

module.exports = {
    guilds: [], // Empty = Global command
    builder: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("View Bot and Discord API latencies."),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    execute: (interaction, client) => {
        interaction.reply({ content: "*Calculating ping...*" }).then(async (res) => {
            let ping = (await interaction.fetchReply()).createdTimestamp - interaction.createdTimestamp;
            interaction.editReply({ content: `> 🤖 | Bot latency: \`${ping}ms\`\n> 🔧 | API latency: \`${client.ws.ping}ms\`` });
        });
    }
}