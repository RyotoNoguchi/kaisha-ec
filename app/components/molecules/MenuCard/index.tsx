import React from 'react'
import { Button } from '~/components/atoms/Button'

type Props = {
  menuItems: {
    name: string
    price: string
    image: string
  }[]
}

export const MenuCard: React.FC<Props> = ({ menuItems }) => {
  return (
    <ul className='w-full flex gap-8 overflow-x-auto whitespace-nowrap'>
      {menuItems.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={index} className='w-56 flex flex-shrink-0 flex-col gap-4 p-4 bg-black mb-2'>
          {/* eslint-disable-next-line hydrogen/prefer-image-component */}
          <img src={item.image} alt='bento' className='w-full' />
          <h3 className='text-secondary font-yumincho'>{item.name}</h3>
          <div className='flex justify-between items-end'>
            <div className='flex '>
              <p className='text-primary text-xl font-bold font-yumincho'>{item.price}円</p>
            </div>
            <Button text='予約' fontWeight='extrabold' />
          </div>
        </li>
      ))}
    </ul>
  )
}
