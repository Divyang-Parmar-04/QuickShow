const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    favorite:[{id:{type:String}}]
})

const USER = mongoose.model('user', userSchema)

module.exports = USER