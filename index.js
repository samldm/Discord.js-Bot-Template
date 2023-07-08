require('dotenv').config();

const Discord = require('discord.js');
const Client = require('./src/Client');

var client = new Client({
    intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMessages
    ]
});

client.init();