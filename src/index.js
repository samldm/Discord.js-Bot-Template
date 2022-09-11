const Client = require('./structure/Client');
let client = new Client({ intents: require('../config/global').intents });

client.init();