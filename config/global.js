const { IntentsBitField: I } = require('discord.js');

module.exports = {
    intents: [
        I.Flags.Guilds
    ],
    paths: { // Based from ./src
        commands: "./commands/",
        events: "./events/"
    }
}