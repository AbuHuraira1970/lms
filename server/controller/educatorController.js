const { clerkClient } = require("@clerk/express");
const Course = require("../model/Course");
const cloudinary = require('cloudinary').v2

// update role to educator
exports.updateRoleEducator = async (req, res) => {
    try {

        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({
                status: "fail",
                msg: "User not authenticated"
            });
        }

        console.log(req.auth)
        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator"
            }
        })
        res.status(200).json({
            status: "success",
            message: "You can publish a course now"
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            msg: error.message
        })
    }
}


// adding new course

exports.addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if(!imageFile){
            return res.json({
                status: "fail",
                message: "Thumbnail Not Attached"
            })
        }


        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.status(201).json({
            status: "success",
            message: "Course Added"
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            msg: error.message
        })
    }
}