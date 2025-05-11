import React, { useEffect, useState } from "react"
import { createContext } from "react";
import { assets, dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react"
import axios from "axios"
import { toast } from "react-toastify";

export const appContext = createContext()


const AppContextProvider = ({ children }) => {

    const curreny = import.meta.env.VITE_CURRENY
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [allCourses, setallCourses] = useState([])
    const [isEducator, setisEducator] = useState(false)
    const [enrolledCourses, setenrolledCourses] = useState([])
    const [userData, setuserData] = useState(null)

    const { getToken } = useAuth()
    const { user } = useUser()

    const navigate = useNavigate()

    const calculateRating = (course) => {
        if (course.courseRatings.length > 0) {
            let totalrating = 0
            course.courseRatings.forEach((Element, index) => {
                totalrating += Element.rating
            })
            return Math.floor(totalrating / course.courseRatings.length)
        } else {
            return 0
        }
    }

    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((Element, index) => {
            return time += Element.lectureDuration
        })
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    const calculateCourseDuration = (course) => {   
        let time = 0
        course.courseContent.map((chapter) => {
            return chapter.chapterContent.map((Element) => {
                return time += Element.lectureDuration
            })
        })
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    const calculateTotalLecture = (course) => {
        let lecture = 0
        course.courseContent.map((chapter) => {
            return chapter.chapterContent.map((Element) => {
                return lecture += 1
            })
        })
        return lecture
    }

    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all')
            if (data.status == 'success') {
                setallCourses(data.courses)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {

        if(user.publicMetadata.role == 'educator'){
            setisEducator(true)
        }

        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/user/data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.status == 'success') {
                setuserData(data.user)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Fetch User Enrolled Courses

    const fetchUserEnrolledCousre = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.status == 'success') {
                setenrolledCourses(data.enrolledCourses.reverse())
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])
    
    const logToken = async () => {
        console.log(await getToken())
    }
    useEffect(() => {
        if (user) {
            logToken()
            fetchUserData()
            fetchUserEnrolledCousre()
        }
    }, [user])


    const value = {
        curreny,
        allCourses,
        calculateRating,
        isEducator,
        setisEducator,
        navigate,
        calculateChapterTime,
        calculateCourseDuration,
        calculateTotalLecture,
        enrolledCourses,
        fetchUserEnrolledCousre,
        backendUrl,
        userData,
        setuserData,
        getToken,
        fetchAllCourses
    }
    return <appContext.Provider value={value}>
        {children}
    </appContext.Provider>
}

export default AppContextProvider