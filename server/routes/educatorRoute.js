const express = require("express")
const educatorController = require("../controller/educatorController") 
const router = express.Router()

router.route("/update-role")
.get(educatorController.updateRoleEducator)

module.exports = router