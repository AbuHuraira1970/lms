// get All Courses

const Course = require("../model/Course")
const Purchase = require("../model/Purchase")
const User = require("../model/User")

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).select(['-courseContent', '-enrolledStudents']).populate("educator")
        res.status(200).json({
            status: "success",
            courses
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}

exports.getCourseById = async (req, res) => {
    try {
        const courseData = await Course.findById(req.params.id).populate("educator")
        // Remove lectureUrl if isPreviewFree is false
        courseData.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = ''
                }
            })
        })
        res.status(200).json({
            status: "success",
            courseData
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}

