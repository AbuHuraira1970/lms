const express = require("express")
const userController = require("./../controller/userController")
const router = express.Router()

router.route("/data").get(userController.getUserData)
router.route("/enrolled-courses").get(userController.userEnrolledCourses)
router.route("/purchase").post(userController.purchaseCourse)

router.route("/update-course-progress").post(userController.updateUserCourseProgress)
router.route("/get-course-progress").post(userController.getUserCourseProgress)
router.route("/add-rating").post(userController.addUserRating)


module.exports = router
