const Logger = require('../utils/Logger');
const Manager = require('../manager/Manager');

const { Client, ClientOptions, Collection, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const TestsManager = require('../manager/TestsManager');

module.exports = class AdvancedClient extends Client
{
    /**
     * Client
     * @param {ClientOptions} opt - Client options
     */
    constructor(opt) {
        super(opt);
        Logger.info("AdvancedClient Starting...");

        this.tests = new TestsManager(this);
        this.manager = new Manager();
        this.manager.commands.fetchAll();

        this.commands = new Collection();
        this.guildCommands = new Collection();
        this.events = new Collection();

        this.configs = {
            global: require('../../config/global')
        }

        this._loadedCmds = [];
    }

    async init() {
        await this.tests.fetchTests();
        await this.tests.runTests("init_start");

        this.loadEvents();
        this.loadCommands();

        this.once("ready", () => {
            let globalCommandsMap = this.commands.map((props) => props.data);

            this.rest.put(
                Routes.applicationCommands(this.user.id),
                { body: globalCommandsMap }
            );

            this.guildCommands.forEach((gcmds, gid) => {
                let guildCommandsMap = gcmds.map((props) => props.data);
                this.rest.put(
                    Routes.applicationGuildCommands(this.user.id, gid),
                    { body: guildCommandsMap }
                );
            });

            this.tests.runTests("ready");
            Logger.log(`${this.user.tag} is ready.`);
        });

        this.login(process.env.TOKEN).catch(() => {
            Logger.error("Invalid token provided. See '/config/global.js'.");
        });
        this.tests.runTests("init_end");
    }

    async loadCommands() {
        Logger.log("Loading commands.");
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

    async loadEvents() {
        Logger.log("Loading events.");
        try {
            let evtPath = path.resolve(__dirname, "..", this.configs.global.paths.events);
            let read = await fs.readdirSync(evtPath);

            read.forEach((f) => {
                let p = path.resolve(evtPath, f);
                if (f.endsWith(".js")) return this._loadEvt(p);
    
                fs.readdir(p, (err, files) => {
                    if (err) return Logger.error(`An error occured while loading events in category '${f}'.`);
                    if (!files) return Logger.error(`No files founds in '${f}'.`);
    
                    files.forEach((f) => {
                        let fp = path.resolve(p, f);
                        if (f.endsWith(".js")) this._loadEvt(fp);
                    });
                });
            });
        } catch(e) {
            Logger.error("An error occured while loading events.");
        }
    }

    async _loadCmd(cmdPath) {
        let props = require(cmdPath);
        let cmdName = cmdPath.split('.').slice(0, -1).join('.').split(path.sep).pop();
        let data = this.manager.commands.data.get(cmdName);
        if (!data) return Logger.error(`No data found for the command '${cmdName}'`);

        props.data = data;
        if (!props.execute) {
            this._loadedCmds.push({ name: cmdName, loaded: false });
            return Logger.error(`Command '${cmdName}' missing 'execute' property.`);
        }
        if (!props.guilds || props.guilds.length === 0) {
            this.commands.set(props.data.name, props);
        } else {
            props.guilds.forEach((gid) => {
                let cmds = this.guildCommands.get(gid);
                if (!cmds) {
                    this.guildCommands.set(gid, new Collection());
                    cmds = this.guildCommands.get(gid);
                }
                cmds.set(props.data.name, props);
            })
        }
        this._loadedCmds.push({ name: cmdName, loaded: true });
    }

    async _loadEvt(evtPath) {
        let props = require(evtPath);
        if (props.name && props.execute) {
            this.on(props.name, props.execute.bind(null, this));
        }
    }
}