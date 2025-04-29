const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    enrolledCourses: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Course"
        }
    ]
},{timestamps: true})

const User = mongoose.model("User",userSchema)
module.exports = User