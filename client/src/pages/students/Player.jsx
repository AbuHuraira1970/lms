import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../../context/AppContext'
import humanizeDuration from 'humanize-duration'
import { useParams } from 'react-router-dom'
import Loading from '../../components/students/Loading'
import { assets } from '../../assets/assets'
import YouTube from 'react-youtube'
import Footer from '../../components/students/Footer'
import Rating from '../../components/students/Rating'

const Player = () => {
  const { courseId } = useParams()
  const { enrolledCourses, calculateChapterTime } = useContext(appContext)
  const [courseData, setcourseData] = useState(null)
  const [openSections, setopenSections] = useState(null)
  const [playerData, setplayerData] = useState(null)

  const toggleFunction = (index)=>{
    setopenSections(prev=> prev == index ? null : index)
  }

  useEffect(() => {
    setcourseData(enrolledCourses.find(Element => Element._id == courseId))
  }, [courseId, enrolledCourses])


  return (
    <>
      {
        courseData ?
          <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
         
            {/* left column */}
            <div>
              {
                playerData ? <div className='md:mt-10'>
                   <YouTube videoId={playerData.lectureUrl.split("/").pop()} iframeClassName='w-full aspect-ratio'></YouTube> 
                   <div className='flex justify-between items-center mt-1'>
                    <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                    <button className='text-blue-600'>{false ? 'Completed' : 'Mark Complete'}</button>
                   </div>
                </div>
                : <img src={courseData.courseThumbnail} alt="" />
              }
            </div>

               {/* right column */}
               <div className='text-gray-800'>
              <h2 className='text-xl font-semibold'>Course Structure</h2>
              <div className='pt-5'>
                {courseData.courseContent.map((chapter, index) => {
                  return <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                    <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-auto' onClick={() => toggleFunction(index)}>
                      <div className='flex items-center gap-2'>
                        <img src={assets.down_arrow_icon} alt="" className={`transform transition-transform ${openSections == index ? 'rotate-180' : ''}`} />
                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                      </div>
                      <p className='text-sm'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${openSections == index ? 'max-h-96' : 'max-h-0'}`}>
                      <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                        {
                          chapter.chapterContent.map((lecture, i) => {
                            return <li className='flex items-start gap-2 py-1' key={i}>
                              <img src={false ? assets.blue_tick_icon : assets.play_icon} alt="" className='w-4 h-4 mt-1' />
                              <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-base'>
                                <p>{lecture.lectureTitle}</p>
                                <div className='flex gap-2'>
                                  {lecture.lectureUrl && <p onClick={() => setplayerData({
                                    ...lecture,
                                    chapter: index + 1,
                                    lecture: i + 1
                                  })} className='text-blue-500 cursor-pointer'>Watch</p>}
                                  <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })} </p>
                                </div>
                              </div>
                            </li>
                          })
                        }
                      </ul>
                    </div>
                  </div>
                })}
              </div>

              <div className='flex items-center gap-2 py-3 mt-10'>
                <h1 className='text-xl font-bold'>Rate this course</h1>
                <Rating initialRating={0}></Rating>
              </div>

            </div>
          </div>
          : <Loading></Loading>
      }
      <Footer></Footer>
    </>
  )
}

export default Player