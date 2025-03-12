const mongoose = require("mongoose");

const connectToMongo = () => {
    mongoose.connect("mongodb+srv://saurabh1080i:saurabh1080i@cluster0.ojrty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}
module.exports = connectToMongo