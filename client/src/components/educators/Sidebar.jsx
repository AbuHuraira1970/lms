import React from 'react'
import { useContext } from 'react';
import { appContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Sidebar = () => {
  const { isEducator } = useContext(appContext)
  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];
  return isEducator && (
    <>
      <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>
        {
          menuItems.map((item,index)=>{
            return <NavLink to={item.path} end={item.path == '/educator'} key={index} className={({isActive})=>`flex items-center 
            md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive? 'bg-indigo-50 border-r-[6px] border-r-indigo-500/90' 
            : ''}`}>
              <img src={item.icon} alt="" className='w-6 h-6' />
              <p className='md:block hidden text-center'>{item.name}</p>
            </NavLink>
          })
        }
      </div>
    </>
  )
}

export default Sidebar