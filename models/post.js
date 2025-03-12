const mongoose = require('mongoose')
const id = mongoose.Schema.Types.ObjectId

const post = mongoose.Schema({
    img: String,
    desc:String,
    user: {
        type: id,
        ref: "user",
        required:true
    },
    likedUsers:[{
        type: id,
        ref: "user",
    }],
    comments:[{
        message:String,
        user:{type:id,ref:"user"}
    }],
    likes: {
        type: Number,
        default: 0
    }
},{timestamps:true})

mongoose.models = []
module.exports = mongoose.model('post', post)