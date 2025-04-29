const WebHook = require("svix")
const User = require("./../model/User")

// Api Controller Function to Manage Clerk User with database

exports.clerkWebHooks = async (req,res)=>{
    try {
        const wHook = new WebHook(process.env.CLERK_WEBHOOK_SECRET)
        const payload = req.body.toString("utf8")
        await wHook.verify(payload,{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })
        const {data,type} = JSON.parse(payload);
        console.log(data)
        switch (type){
            case 'user.created':
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + ' ' + data.last_name,
                    imageUrl: data.image_url 
                }
                const user = await User.create(userData)
                res.status(201).json(user)
            break
            case 'user.updated':
                const uData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + ' ' + data.last_name,
                    imageUrl: data.image_url 
                }
                const u = await User.findByIdAndUpdate(data.id,uData,{new:true})
                res.status(201).json(u)
            break
            case 'user.deleted':
                await User.findByIdAndDelete(data.id)
                res.status(204).json({})
            break
        }
    } catch (error) {
        res.status(404).json({
            status: "fail",
            msg: error.message
        })
    }
}