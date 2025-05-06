const Course = require("../model/Course")
const Purchase = require("../model/Purchase")
const User = require("../model/User")
const Stripe = require("stripe")

// get User Data
exports.getUserData = async(req,res)=>{
    try {
        const user = await User.findById(req.auth.userId)
        if(!user){
            return res.status(404).json({
                status: "fail",
                message: "User Not Found!"
            })
        }
        res.status(200).json({
            status: "success",
            user
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            msg: error.message
        })
    }
}

// User Enrolled Courses With Lecture Links

exports.userEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId).populate('enrolledCourses')
        res.status(200).json({
            status: "success",
            enrolledCourses: user.enrolledCourses
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            msg: error.message
        })
    }
}


exports.purchaseCourse = async (req, res) => {
    try {
        console.log("✅ Step 1: Route hit");
        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth.userId

        console.log("📌 Step 2: courseId =", courseId, "userId =", userId, "origin =", origin);

        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)


        console.log("👤 Step 3: userData =", !!userData);
        console.log("📘 Step 4: courseData =", !!courseData);

        if (!userData || !courseData) {
            return res.status(404).json({
                status: "fail",
                message: "Data Not Found"
            })
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }


        console.log("💵 Step 5: calculated amount =", purchaseData.amount);

        const newPurchase = await Purchase.create(purchaseData)

        console.log("🧾 Step 6: newPurchase ID =", newPurchase._id);

        // Stripe Gateway Initialize

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()

        console.log("💳 Step 7: Stripe init done, currency =", currency);

        // Creating line items to for stripe

        const line_items = [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: courseData.courseTitle,
                    },
                    unit_amount: Math.floor(newPurchase.amount) * 100
                },
                quantity: 1
            }
        ]

        console.log("🧾 Step 8: line_items =", line_items);

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: "payment",
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        console.log("✅ Step 9: Stripe session created:", session.url);

        res.status(200).json({
            status: "success",
            session_url: session.url
        })

    } catch (error) {
        console.error("❌ Step ERROR:", error.message);
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}