import { Image } from '@shopify/hydrogen'
import React from 'react'

type Props = {
  title: string
  text: string
  imageUrl: string
}

export const ChefIntro: React.FC<Props> = ({ title, text, imageUrl }) => {
  const paragraphs = text.split('。').filter((paragraph) => paragraph.trim() !== '')
  return (
    <div className='flex flex-col gap-9 bg-beige p-9'>
      <h2 className='flex font-extrabold font-yumincho text-2xl'>{title}</h2>
      <div className='flex flex-col md:flex-row'>
        <div className='w-full lg:w-1/2 rounded-none bg-black flex items-center'>
          <Image src={imageUrl} alt='about chef' className='rounded-none' />
        </div>
        <div className='flex justify-center p-4 md:py-12 md:px-9 w-full lg:w-1/2 bg-black text-white'>
          <p className='break-words font-yumincho font-normal md:font-bold text-base xl:text-xl h-48 lg:h-72 xl:h-full overflow-y-auto'>
            {paragraphs.map((paragraph) => (
              <React.Fragment key={paragraph}>
                {paragraph}。
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}
