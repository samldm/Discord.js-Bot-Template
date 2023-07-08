const { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Client = require('../Client');

module.exports = {
    name: 'click_me',
    builder: new SlashCommandBuilder()
        .setName('click_me')
        .setDescription('Click on the button!'),
    
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('click_me_1')
                    .setLabel('Click me!')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('click_me_2')
                    .setLabel('Click me!')
                    .setStyle(ButtonStyle.Secondary)
            );
        await interaction.reply({
            content: 'Click on the button!',
            components: [row]
        });  
    },

    interactions: {
        click_me_1: async (client, interaction) => {
            await interaction.reply('You clicked me! 1');
        },
        click_me_2: async (client, interaction) => {
            await interaction.reply('You clicked me! 2');
        }
    }
}