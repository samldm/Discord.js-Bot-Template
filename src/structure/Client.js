const { Client, ClientOptions, Collection, Routes } = require('discord.js');
const Logger = require('../utils/Logger');
const fs = require('fs');
const path = require('path');

module.exports = class extends Client
{
    /**
     * Client
     * @param {ClientOptions} opt - Client options
     */
    constructor(opt) {
        super(opt);

        this.commands = new Collection();
        this.guildCommands = new Collection();
        this.events = new Collection();

        this.configs = {
            global: require('../../config/global')
        }

        this._loadedCmds = [];
    }

    async init() {
        this.loadCommands();

        this.once("ready", () => {
            let globalCommandsMap = this.commands.map((props) => props.builder.toJSON());
            this.rest.put(
                Routes.applicationCommands(this.user.id),
                { body: [globalCommandsMap] }
            );

            this.guildCommands.forEach((gcmds, gid) => {
                let guildCommandsMap = gcmds.map((props) => props.builder.toJSON());
                this.rest.put(
                    Routes.applicationGuildCommands(this.user.id, gid),
                    { body: [guildCommandsMap] }
                );
            });
        });

        this.login(this.configs.global.token).catch(() => {
            Logger.error("Invalid token provided. See '/config/global.js'.");
        })
    }

    async loadCommands() {
        try {
            let cmdPath = path.resolve(__dirname, "..", this.configs.global.paths.commands);
            let read = await fs.readdirSync(cmdPath);

            read.forEach((f) => {
                let p = path.resolve(cmdPath, f);
                if (f.endsWith(".js")) return this._loadCmd(p);
    
                fs.readdir(p, (err, files) => {
                    if (err) return Logger.error(`An error occured while loading commands in category '${f}'.`);
                    if (!files) return Logger.error(`No files founds in '${f}'.`);
    
                    files.forEach((f) => {
                        let fp = path.resolve(p, f);
                        if (f.endsWith(".js")) this._loadCmd(fp);
                    });
                });
            });
        } catch(e) {
            return Logger.error("An error occured while loading commands.");
        }
    }

    async _loadCmd(cmdPath) {
        let props = require(cmdPath);
        let cmdName = cmdPath.split(path.sep).pop();
        if (!props.builder || !props.execute) {
            this._loadedCmds.push({ name: cmdName, loaded: false });
            return Logger.error(`Command '${cmdName}' missing 'builder' or 'execute' properties.`);
        }
        if (!props.guilds || props.guilds.length === 0) {
            this.commands.set(props.builder.name, props);
        } else {
            props.guilds.forEach((gid) => {
                let cmds = this.guildCommands.get(gid);
                if (!cmds) {
                    this.guildCommands.set(gid, new Collection());
                    cmds = this.guildCommands.get(gid);
                }
                cmds.set(props.builder.name, props);
            })
        }
        this._loadedCmds.push({ name: cmdName, loaded: true });
    }
}