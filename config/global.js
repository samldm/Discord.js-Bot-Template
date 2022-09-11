const { IntentsBitField: I } = require('discord.js');

module.exports = {
    token: "your client token",
    intents: [
        I.Flags.Guilds
    ],
    paths: { // Based from ./src
        commands: "./commands/",
        events: "./events/"
    }
}