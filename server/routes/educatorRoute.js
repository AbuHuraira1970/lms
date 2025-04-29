const express = require("express")
const educatorController = require("../controller/educatorController") 
const router = express.Router()

router.route("/update-role")
.post(educatorController.updateRoleEducator)

module.exports = router