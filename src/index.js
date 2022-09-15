require('dotenv').config();

const AdvancedClient = require('./structure/Client');

let client = new AdvancedClient({ intents: require('../config/global').intents });

client.init();