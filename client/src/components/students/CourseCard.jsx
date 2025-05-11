import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { appContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const { curreny, calculateRating } = useContext(appContext)
  return (
    <>
      <Link to={`/course/${course._id}`} onClick={() => scrollTo(0, 0)} className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg'>
        <img className='w-full' src={course.courseThumbnail} alt="" />
        <div className='p-3 text-left'>
          <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
          {/* <p className='text-gray-500'>{course.educator.name}</p> */}
          <p className='text-gray-500'>{course.educator?.name}</p>
          <div className='flex items-center space-x-2'>
            <p>{calculateRating(course)}</p>
            <div className='flex'>
              {
                [1, 2, 3, 4, 5].map((el, i) => {
                  return <img key={i} src={el <= calculateRating(course) ? assets.star : assets.star_blank} className='w-3.5 h-3.5' />
                })
              }
            </div>
            <p className='text-gray-500'>({course.courseRatings.length})</p>
          </div>
          <p className='text-base font-semibold text-gray-800'>{curreny}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
        </div>
      </Link>
    </>
  )
}

export default CourseCard