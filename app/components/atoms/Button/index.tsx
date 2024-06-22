import React from 'react'

type Props = {
  text: string
  fontWeight: 'bold' | 'extrabold' | 'normal'
  backgroundColor?: 'primary' | 'secondary' | 'crimsonRed'
  onClick?: () => void
}

export const Button: React.FC<Props> = ({ text, fontWeight, backgroundColor = 'primary', onClick }) => {
  return (
    <button className={`w-max flex justify-center items-center bg-${backgroundColor} rounded-full px-3 py-2`} onClick={onClick}>
      <p className={`text-black w-full font-yumincho font-${fontWeight}`}>{text}</p>
    </button>
  )
}
