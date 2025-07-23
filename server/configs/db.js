const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

function connectDB() {
    mongoose.connect(`${process.env.MONGODB_URL}QuickShow`)
    // mongoose.connect(`mongodb://localhost:27017/QuickShow`)
        .then((res) => console.log("mongoDB connected"))
        .catch((err) => console.log(err))

}

module.exports = connectDB