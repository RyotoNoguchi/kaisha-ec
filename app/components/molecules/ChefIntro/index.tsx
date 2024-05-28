import React from 'react'

type Props = {
  title: string
}

export const ChefIntro: React.FC<Props> = ({ title }) => {
  return (
    <div className='flex flex-col gap-9 bg-beige pt-9 pb-16 px-16'>
      <h2 className='flex font-extrabold font-yumincho text-2xl'>{title}</h2>
      <div className='flex'>
        {/* eslint-disable-next-line hydrogen/prefer-image-component */}
        <img src='/image/pages/home/thought-of-chef.webp' alt='thought of the chef' className='w-full' />
      </div>
    </div>
  )
}
