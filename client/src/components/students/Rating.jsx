import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const Rating = ({initialRating,onRate}) => {
  const [rating, setrating] = useState(initialRating || 0)

  const handleRating = (value)=>{
    setrating(value)
    if(onRate) onRate(value)
  }

  useEffect(() => {
    if(initialRating){
      setrating(initialRating)
    }
  }, [initialRating])
  

  return (
    <>
      <div>
        {
          [1,2,3,4,5].map((Element,index)=>{
            const startValue = Element
            return <span onClick={()=>handleRating(startValue)} className={`text-xl sm:text-2xl cursor-pointer transition-colors 
            ${startValue <= rating ? 'text-yellow-500 ' : 'text-gray-400' }`}>
                &#9733;
            </span>
          })
        }
      </div>
    </>
  )
}

export default Rating