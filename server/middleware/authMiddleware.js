const {clerkClient} = require("@clerk/express")

// protect Educator Router

exports.protectEducator = async(req,res,next)=>{
    try {
        const userId = req.auth.userId
        const response = await clerkClient.users.getUser(userId)

        if(response.publicMetadata.role != "educator"){
            return  res.status(404).json({
                status: "fail",
                message: "Unauthorized Access"
            })
        }

        next()

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}