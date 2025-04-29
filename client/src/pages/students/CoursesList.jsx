import React, { useContext, useEffect } from 'react'
import { appContext } from '../../context/AppContext'
import SearchBar from '../../components/students/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/students/CourseCard'
import { useState } from 'react'
import { assets } from '../../assets/assets'
import Footer from '../../components/students/Footer'

const CoursesList = () => {
  const { navigate, allCourses } = useContext(appContext)
  const [filterCourse, setfilterCourse] = useState([])
  const {input} = useParams()

  console.log(allCourses)


  useEffect(() => {
    if(allCourses.length > 0){
      const tempCourse = [...allCourses]
      input ? setfilterCourse(tempCourse.filter(Element=>Element.courseTitle.toLowerCase().includes(input.toLowerCase()))) :
      setfilterCourse(tempCourse)
    }
  }, [input,allCourses])
  

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        <div className='flex md:flex-row flex-col gap-6 items-center justify-between w-full'>
          <div className='flex flex-col items-center md:items-start'>
            <h1 className='text-4xl font-semibold text-gray-800 mb-2'>Course List</h1>
            <p className='text-gray-500'><span onClick={() => navigate("/")} className='text-blue-500 cursor-pointer'>Home</span> / <span>Course List</span></p>
          </div>
          <SearchBar data={input}></SearchBar>
        </div>
        {
          input && <div className='inline-flex items-center gap-4 px-4 py-2 border border-gray-300 mt-8 -mb-8 text-gray-600 rounded'>
            <p>{input}</p>
            <img className='cursor-pointer' src={assets.cross_icon} alt="" onClick={()=>navigate("/course-list")} />
          </div>
        }
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4'>
            {
              filterCourse.map((Element,index)=>{
                return <CourseCard key={index} course={Element}></CourseCard>
              }) 
            }
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}

export default CoursesList