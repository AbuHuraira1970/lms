import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <>
      <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
        <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Learn anything, anytime, anywhere</h1>
        <p className='text-gray-500 sm:text-sm'>Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam <br /> aliqua proident excepteur commodo do ea.</p>
        <div className='flex items-center font-medium gap-6 mt-4'>
          <button className='bg-blue-600 text-white rounded-md px-10 py-3 cursor-pointer'>Get Started</button>
          <button className='flex items-center gap-2 cursor-pointer'>Learn More <img src={assets.arrow_icon} alt="" /> </button>
        </div>
      </div>
    </>
  )
}

export default CallToAction