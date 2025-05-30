const mongoose = require("mongoose")
const {Schema} = mongoose

const courseProgressSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    lectureCompleted: []
},{minimize: false})

const CourseProgress = mongoose.model("CourseProgress",courseProgressSchema)

module.exports = CourseProgress