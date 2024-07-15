import React from 'react'
import { type Tailwind } from 'types/tailwind'

type Props = {
  text: string
  fontWeight: 'bold' | 'extrabold' | 'normal'
  backgroundColor?: 'bg-primary' | 'bg-secondary' | 'bg-crimsonRed' | Tailwind['backgroundColor']
  borderWidth?: 'border' | 'border-1' | 'border-2' | 'border-4' | 'border-8' | 'border-0'
  borderStyle?: 'border-solid' | 'border-dashed' | 'border-dotted' | 'border-double' | 'border-none'
  borderColor?: 'border-slate-700' | 'border-slate-400' | 'border-slate-200' | 'border-slate-100' | 'border-slate-0'
  opacity?: 'opacity-100' | 'opacity-80' | 'opacity-60' | 'opacity-40' | 'opacity-20' | 'opacity-0'
  className?: string
  onClick?: () => void
}

export const Button: React.FC<Props> = ({
  text,
  fontWeight,
  backgroundColor = 'primary',
  borderWidth = 'border-0',
  borderStyle = 'border-solid',
  borderColor = 'border-slate-700',
  opacity = 'opacity-100',
  className,
  onClick
}) => {
  return (
    <button className={`w-max flex justify-center items-center ${borderWidth} ${borderStyle} ${borderColor} ${backgroundColor} rounded-full px-3 py-2 ${opacity} ${className}`} onClick={onClick}>
      <p className={`text-black w-full font-yumincho font-${fontWeight}`}>{text}</p>
    </button>
  )
}
