const {Schema, model, ObjectId} = require("mongoose")

const Token = new Schema({
    userId: [{type: ObjectId, ref: 'User'}],
    refreshToken: {type: String},
})

module.exports = model('Token', Token)