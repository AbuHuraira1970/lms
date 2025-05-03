const express = require("express")
const courseController = require("../controller/courseController")
const router = express.Router()

router.route("/all").get(courseController.getAllCourses)
router.route("/:id").get(courseController.getCourseById)

module.exports = router