const { clerkClient } = require("@clerk/express");
const User = require("../model/User")
const Course = require("../model/Course");
const Purchase = require("../model/Purchase");
const cloudinary = require('cloudinary').v2

// update role to educator
exports.updateRoleEducator = async (req, res) => {
    try {

        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({
                status: "fail",
                message: "User not authenticated"
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
            message: error.message
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


        console.log(courseData,imageFile)
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
            message: error.message
        })
    }
}

exports.getEducatorCourses = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const courses = await Course.find({educator: userId})
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

// Get Educator DashbordData (total earning, enrolled student and no of courses)

exports.educatorDashbordData = async (req,res) =>{
    try {
        const userId = req.auth.userId
        const courses = await Course.find({educator: userId})
        const totalCourses = courses.length

        const courseIds = courses.map(course => course._id)

        // calculate total earning from purchases
        const purchases = await Purchase.find({courseId: {$in: courseIds}, status: "completed"})
        const totalEarnings = purchases.reduce((acc,purchase)=>{return purchase.amount + acc},0)

        // collect unique enrolled studented id with thire course Title

        const enrolledStudentsData = []
        for(const course of courses){
            const students = await User.find({_id: {$in: course.enrolledStudents}},"name imageUrl")
            students.forEach((student)=>{
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }

        res.status(200).json({
            status: "success",
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}

// get enrolled student data with purchase date

exports.getEnrolledstudentsData = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const courses = await Course.find({educator: userId})
        const courseIds = courses.map(course=> course._id)
        const purchases = await Purchase.find({ courseId: {$in: courseIds},status: "completed"}).populate("userId","name imageUrl").populate('courseId', 'courseTitle')
        const enrolledStudents = purchases.map((purchase)=>{
            return {
                student: purchase.userId,
                courseTitle: purchase.courseId.courseTitle,
                purchaseDate: purchase.createdAt
            }
        })
        res.status(200).json({
            status: "success",
            enrolledStudents
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}