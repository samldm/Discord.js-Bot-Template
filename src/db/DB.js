const mongoose = require('mongoose');

module.exports = class DB {
    constructor() {
        this.users = new (require('./models/Users')).class();
        this.guilds = new (require('./models/Guilds')).class();
    }

    init() {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        mongoose.connection.on('connected', () => {
            console.log(`[DB] Connected to MongoDB`);
        });

        mongoose.connection.on('error', (err) => {
            console.error(`[DB] Error connecting to MongoDB: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn(`[DB] Disconnected from MongoDB`);
        });
    }
}