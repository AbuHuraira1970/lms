const express = require("express")
const educatorController = require("../controller/educatorController") 
const upload = require("../configs/multer")
const { protectEducator } = require("../middleware/authMiddleware")
const router = express.Router()

router.route("/update-role")
.get(educatorController.updateRoleEducator)

router.route("/add-course").post(upload.single("image"),protectEducator,educatorController.addCourse)
router.route("/courses").get(protectEducator,educatorController.getEducatorCourses)
router.route("/dashboard").get(protectEducator,educatorController.educatorDashbordData)
router.route("/enrolled-students").get(protectEducator,educatorController.getEnrolledstudentsData)

module.exports = router