const Course = require("../model/Course")
const CourseProgress = require("../model/CourseProgress")
const Purchase = require("../model/Purchase")
const User = require("../model/User")
const Stripe = require("stripe")

// get User Data
exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.auth.userId)
        if (!user) {
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

exports.userEnrolledCourses = async (req, res) => {
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
        console.log(userData)
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


exports.updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId, lectureId } = req.body

        const progressData = await CourseProgress.findOne({ userId: userId, courseId: courseId })
        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.status(200).json({
                    status: "success",
                    message: "Lecture Already Completed"
                })
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }
        else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [
                    lectureId
                ]
            })
        }
        res.status(200).json({
            status: "success",
            message: "Progress Updated"
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}

exports.getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId } = req.body

        const progressData = await CourseProgress.findOne({ userId: userId, courseId: courseId })
        res.status(200).json({
            status: "success",
            progressData
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}

exports.addUserRating = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId, rating } = req.body

        if (!userId || !courseId || !rating || rating < 1 || rating > 5) {
            return res.status(404).json({
                status: "fail",
                message: "Invaild Details"
            })
        }

        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({
                status: "fail",
                message: "Course not found!"
            })
        }

        const user = await User.findById(userId)

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.status(404).json({
                status: "fail",
                message: "User has not purchased this Course!"
            })
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId == userId)

        if (existingRatingIndex > -1) {
            course.courseRatings[existingRatingIndex].rating = rating
        }
        else {
            course.courseRatings.push({ userId, rating })
        }

        await course.save()

        res.status(200).json({
            status: "success",
            message: "Rating added"
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}