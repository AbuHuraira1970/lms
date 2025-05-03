const mongoose = require("mongoose")
const {Schema} = mongoose

const purchaseSchema = new Schema({
    courseId: {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
        required: true
    },
    userId: {
        type: String,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["pending","completed","failed"],
            message: 'status can not be other than pending, completed and failed'
        },
        default: "pending"
    }
},{timestamps: true})

const Purchase = mongoose.model("Purchase",purchaseSchema)

module.exports = Purchase