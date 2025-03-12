const mongoose = require('mongoose')
const id = mongoose.Schema.Types.ObjectId

const User = mongoose.Schema({
    username:String,
    email: String,
    password: String,
    profileImg:String,
    followers: [{ type: id, ref: "user" }],
    following: [{ type: id, ref: "user" }],
    activities:Array
})

module.exports = mongoose.model("user", User)