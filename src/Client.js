const { Client, ClientOptions, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

const Logger = new(require('./utils/Logger'))();

module.exports = class extends Client {
    
    /**
     * 
     * @param {ClientOptions} options 
     */
    constructor(options) {
        super(options);
        this.commands = new Collection();

        this.db = new(require('./db/DB'))();
    }

    init() {
        this.loadCommands();
        this.loadEvents();
        this.db.init();

        this.login(process.env.TOKEN);
    }

    loadCommands() {
        var loadCmd = (p) => {
            const cmd = require(p);
            if (!cmd.name || !cmd.builder || !cmd.run) return;
            this.commands.set(cmd.name, cmd);
            Logger.log(`Loaded command ${cmd.name}`);
        }

        var loadDir = (p, r) => {
            if (r <= 0) return;
            const files = fs.readdirSync(p);
            for (const file of files) {
                const stat = fs.lstatSync(path.join(p, file));
                if (stat.isDirectory()) {
                    loadDir(path.join(p, file), r - 1);
                } else if (stat.isFile()) {
                    loadCmd(path.join(p, file));
                }
            }
        }
        
        const dir = path.join(__dirname, 'commands');
        loadDir(dir, 5);

        this.on('interactionCreate', async (interaction) => {
            if (interaction.isCommand()) {
                const cmd = this.commands.get(interaction.commandName);
                if (!cmd) return;
                try {
                    await cmd.run(this, interaction);
                } catch (e) {
                    Logger.error(e);
                    await interaction.reply('An error occured while executing this command!');
                }
            } else {
                const interactionId = interaction.customId;
                for (const cmd of this.commands.values()) {
                    if (!cmd.interactions) continue;
                    if (interactionId in cmd.interactions) {
                        try {
                            await cmd.interactions[interactionId](this, interaction);
                        } catch (e) {
                            Logger.error(e);
                            await interaction.reply('An error occured while executing this command!');
                        }
                        return
                    }
                }
            }
        });
    }

    postCommands() {
        const cmds = this.commands.map(cmd => cmd.builder.toJSON());
        this.application.commands.set(cmds);
    }

    loadEvents() {
        var loadEvt = (p) => {
            const evt = require(p);
            if (!evt.name || !evt.run) return;
            this.on(evt.name, evt.run.bind(null, this));
            Logger.log(`Loaded event ${evt.name}`);
        }

        var loadDir = (p, r) => {
            if (r <= 0) return;
            const files = fs.readdirSync(p);
            for (const file of files) {
                const stat = fs.lstatSync(path.join(p, file));
                if (stat.isDirectory()) {
                    loadDir(path.join(p, file), r - 1);
                } else if (stat.isFile()) {
                    loadEvt(path.join(p, file));
                }
            }
        }

        const dir = path.join(__dirname, 'events');
        loadDir(dir, 5);
    }
}