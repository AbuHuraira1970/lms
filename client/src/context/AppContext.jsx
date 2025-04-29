import React, { useEffect, useState } from "react"
import { createContext } from "react";
import { assets, dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import {useAuth,useUser} from "@clerk/clerk-react"

export const appContext = createContext()


const AppContextProvider = ({ children }) => {

    const curreny = import.meta.env.VITE_CURRENY
    const [allCourses, setallCourses] = useState([])
    const [isEducator, setisEducator] = useState(true)
    const [enrolledCourses, setenrolledCourses] = useState([])

    const {getToken} = useAuth()
    const {user} = useUser()
 
    const navigate = useNavigate()

    const calculateRating = (course) =>{
        if(course.courseRatings.length > 0){
            let totalrating = 0
            course.courseRatings.forEach((Element,index)=>{
                totalrating += Element.rating
            })
            return totalrating / course.courseRatings.length
        }else{
            return 0 
        }
    }

    const calculateChapterTime = (chapter) =>{
        let time = 0
        chapter.chapterContent.map((Element,index)=>{
            return time += Element.lectureDuration
        })
        return humanizeDuration(time * 60 * 1000, {units: ["h","m"]})
    }

    const calculateCourseDuration = (course)=>{
        let time = 0
        course.courseContent.map((chapter)=>{
            return chapter.chapterContent.map((Element)=>{
                return time += Element.lectureDuration
            })
        })
        return humanizeDuration(time * 60 * 1000, {units: ["h","m"]})
    }

    const calculateTotalLecture = (course)=>{
        let lecture = 0
        course.courseContent.map((chapter)=>{
            return chapter.chapterContent.map((Element)=>{
                return lecture += 1
            })
        })
        return lecture
    }

    const fetchAllCourses = async()=>{
        setallCourses(dummyCourses)
    }

    // Fetch User Enrolled Courses

    const fetchUserEnrolledCousre = async() =>{
        setenrolledCourses(dummyCourses)
    }

    useEffect(() => {
      fetchAllCourses()
      fetchUserEnrolledCousre()
    }, [])

    const logToken = async()=>{
        console.log(await getToken())
    } 
    useEffect(() => {
      if(user){
        logToken()
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
        fetchUserEnrolledCousre
    }
    return <appContext.Provider value={value}>
        {children}
    </appContext.Provider>
}

export default AppContextProvider