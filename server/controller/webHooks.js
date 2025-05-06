const { Webhook } = require("svix")
const User = require("./../model/User")
const Stripe = require("stripe")
const Purchase = require("../model/Purchase")
const Course = require("../model/Course")

// Api Controller Function to Manage Clerk User with database

exports.clerkWebHooks = async (req, res) => {
    try {
        const wHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        await wHook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })
        const { data, type } = req.body;
        console.log(data)
        switch (type) {
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
                const u = await User.findByIdAndUpdate(data.id, uData, { new: true })
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


exports.stripeWebhooks = async (req, res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    console.log("stripe webhook success hit!")
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        switch (event.type) {
            case 'payment_intent.succeeded':{
                console.log("payment success hit!")
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                })

                const { purchaseId } = session.data[0].metadata

                const purchaseData = await Purchase.findById(purchaseId)
                const userData = await User.findById(purchaseData.userId)
                const courseData = await Course.findById(purchaseData.courseId.toString())

                courseData.enrolledStudents.push(userData)
                await courseData.save()

                userData.enrolledCourses.push(courseData._id)
                await userData.save()

                purchaseData.status = 'completed'
                await purchaseData.save()


                break;
            }
            case 'payment_intent.payment_failed': {

                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                })

                const { purchaseId } = session.data[0].metadata

                const purchaseData = await Purchase.findById(purchaseId)
                purchaseData.status = 'failed'
                await purchaseData.save()
                break;
            }
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).json({
            received: true
        })
    }
    catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }

}