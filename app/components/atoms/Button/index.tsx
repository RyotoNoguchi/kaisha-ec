import React from 'react'

type Props = {
  text: string
  fontWeight: 'bold' | 'extrabold' | 'normal'
}

export const Button: React.FC<Props> = ({ text, fontWeight }) => {
  return (
    <button className='w-max flex justify-center items-center bg-primary rounded-full px-3 py-2'>
      <p className={`text-black w-full font-yumincho font-${fontWeight}`}>{text}</p>
    </button>
  )
}
