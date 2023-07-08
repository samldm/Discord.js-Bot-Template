const { Schema, model } = require('mongoose');

const GuildSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    ownerID: {
        type: String,
        required: true
    }
});

module.exports = {
    model: model('Guild', GuildSchema),
    class: class Guild {
        constructor() {

        }

        async get(id) {
            let guild = await this.model.findOne({ id });
            if (!guild)
                return null;
            return guild;
        }

        async create(id, ownerID) {
            let guild = await this.model.findOne({ id });
            if (guild)
                return guild;
            guild = new this.model({ id, ownerID });
            await guild.save();
            return guild;
        }
    }
}