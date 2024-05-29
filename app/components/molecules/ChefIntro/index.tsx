import React from 'react'

type Props = {
  title: string
  text: string
}

export const ChefIntro: React.FC<Props> = ({ title, text }) => {
  const paragraphs = text.split('。').filter((paragraph) => paragraph.trim() !== '')
  return (
    <div className='flex flex-col gap-9 bg-beige p-4 md:pt-9 pb-16 md:px-16'>
      <h2 className='flex font-extrabold font-yumincho text-2xl'>{title}</h2>
      <div className='flex flex-col lg:flex-row'>
        {/* eslint-disable-next-line hydrogen/prefer-image-component */}
        <img src='/image/pages/home/chef.webp' alt='thought of the chef' className='w-full lg:w-1/2 rounded-none' />
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
