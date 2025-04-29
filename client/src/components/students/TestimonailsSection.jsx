import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonailsSection = () => {
  return (
    <>
      <div className='pb-14 px-8 md:px-0'>
        <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
        <p className='md:text-base text-gray-500 mt-3'>Hear from our learners as they share their journeys of transformation, success, and how our <br /> platform has made a difference in their lives.</p>
        {/* grid-cols-1 md:grid-cols-2 lg:grid-cols-4 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14 md:px-40 px-8'>
          {
            dummyTestimonial.map((Element, index) => {
              return <div key={index} className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px]   overflow-hidden shadow-black/5'>
              <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                  <img className='h-12 w-12 rounded-full' src={Element.image} alt="" />
                  <div>
                    <h1 className='text-lg font-medium text-gray-800'>{Element.name}</h1>
                    <p className='text-gray-800/80'>{Element.role}</p>
                  </div>
              </div>
                <div className='p-5 pb-7'>
                  <div className='flex gap-0.5'>
                    {
                      [1, 2, 3, 4, 5].map((El, index) => {
                        return <img className='h-5' src={El <= Element.rating ? assets.star : assets.star_blank} />
                      })
                    }
                  </div>
                  <p className='text-gray-500 mt-5'>{Element.feedback}</p>
                </div>
                <a href="#" className='text-blue-500 underline px-5'>Read More</a>
              </div>
            })
          }
        </div>
      </div>
    </>

  )
}

export default TestimonailsSection