import React from 'react'

type Props = {
  title: string
}

export const CartLineTitle: React.FC<Props> = ({ title }) => {
  return <p className='text-base sm:text-xl sm:text-bold leading-8'>{title}</p>
}
