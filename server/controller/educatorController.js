const { clerkClient } = require("@clerk/express")

// update role to educator
exports.updateRoleEducator = async (req, res) => {
    try {
        console.log(req.auth)
        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
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