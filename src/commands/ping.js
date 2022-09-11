const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const AdvancedClient = require('../structure/Client');

module.exports = {
    guilds: [], // Empty = Global command
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {AdvancedClient} client 
     */
    execute: (interaction, client) => {
        interaction.reply({ content: "*Calculating ping...*" }).then(async (res) => {
            let ping = (await interaction.fetchReply()).createdTimestamp - interaction.createdTimestamp;
            interaction.editReply({ content: `> 🤖 | Bot latency: \`${ping}ms\`\n> 🔧 | API latency: \`${client.ws.ping}ms\`` });
        });
    }
}