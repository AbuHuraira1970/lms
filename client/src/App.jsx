import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/students/Home'
import CoursesList from './pages/students/CoursesList'
import CourseDetail from './pages/students/CourseDetail'
import MyEnrollments from './pages/students/MyEnrollments'
import Player from './pages/students/Player'
import Loading from './components/students/Loading'
import Educator from './pages/educators/Educator'
import Dashboard from './pages/educators/Dashboard'
import AddCourse from './pages/educators/AddCourse'
import MyCourses from './pages/educators/MyCourses'
import StudentEnrollemnt from './pages/educators/StudentEnrollemnt'
import Navbar from './components/students/navbar'
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';


const App = () => {
  const isEducatorRoute = useMatch('/educator/*')

  return (
    <>
      <div className='text-default min-h-screen bg-white'>
        <ToastContainer></ToastContainer>
        {!isEducatorRoute && <Navbar></Navbar>}
        <Routes>
          <Route path='/' element={<Home></Home>} />
          <Route path='/course-list' element={<CoursesList></CoursesList>} />
          <Route path='/course-list/:input' element={<CoursesList></CoursesList>} />
          <Route path='/course/:id' element={<CourseDetail></CourseDetail>} />
          <Route path='/my-enrollments' element={<MyEnrollments></MyEnrollments>} />
          <Route path='/player/:courseId' element={<Player></Player>} />
          <Route path='/loading/:path' element={<Loading></Loading>} />

          <Route path='/educator' element={<Educator></Educator>}>
            <Route path='' element={<Dashboard></Dashboard>} />
            <Route path='add-course' element={<AddCourse></AddCourse>} />
            <Route path='my-courses' element={<MyCourses></MyCourses>} />
            <Route path='student-enrolled' element={<StudentEnrollemnt></StudentEnrollemnt>} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App