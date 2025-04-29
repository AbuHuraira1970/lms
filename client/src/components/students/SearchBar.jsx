import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({data}) => {
   const [value, setvalue] = useState(data ? data : '')
    const navigate = useNavigate()

    const handleSumbit = (e)=>{
        e.preventDefault()
        navigate("/course-list/"+value)
    } 

    return (
        <>
            <form onSubmit={(e)=>handleSumbit(e)} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'>
                <img src={assets.search_icon} alt="search" className='md:w-auto w-10 px-3' />
                <input value={value}  onChange={(e)=>setvalue(e.target.value)} className='w-full h-full outline-none text-gray-500/80' type="text" name="" id="" placeholder='Search For Courses' />
                <button type='submit' className='bg-blue-600 rounded text-white px-7 md:px-10 py-2 md:py-3 mx-1 cursor-pointer'>Search</button>
            </form>
        </>
    )
}

export default SearchBar