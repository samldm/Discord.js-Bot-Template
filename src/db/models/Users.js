const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = {
    model: model('User', UserSchema),
    class: class User {
        constructor() {

        }

        async get(id) {
            let user = await this.model.findOne({ id });
            if (!user) {
                user = new this.model({ id });
                await user.save();
            }
            return user;
        }
    }
}