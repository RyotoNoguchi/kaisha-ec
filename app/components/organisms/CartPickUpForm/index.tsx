import React from 'react'
import DateSelector from '~/components/atoms/DateSelector'
import { TimeSelector } from '~/components/atoms/TimeSelector'

type Props = {
  isPickupDateAndTimeSelected: boolean
  children: React.ReactNode
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>
}

export const CartPickUpForm: React.FC<Props> = ({ isPickupDateAndTimeSelected, setSelectedDate, setSelectedTime, children }) => {
  return (
    <div className='flex flex-col gap-2'>
      {children}
      <div className='grid grid-cols-[2fr,1fr] lg:grid-cols-[1fr,1fr] gap-4 md:gap-6 lg:gap-8'>
        <div className='flex gap-2 items-start justify-end'>
          <span className='bg-crimsonRed text-white text-sm py-1 px-2'>必須</span>
          <p className='text-xl font-semibold'>受取日時</p>
        </div>
        <div className='flex flex-col md:flex-row lg:flex-col gap-1'>
          <DateSelector onChange={setSelectedDate} />
          <TimeSelector onChange={setSelectedTime} />
        </div>
      </div>
      {isPickupDateAndTimeSelected && (
        <div className='flex flex-col md:items-end'>
          <p className=''>
            必ず、次の注文ページにて
            <span className='font-bold px-0.5 text-crimsonRed'>配達</span>項目の
            <span className='font-bold px-0.5 text-crimsonRed'>ストアで受け取る</span>を選択してください
          </p>
        </div>
      )}
    </div>
  )
}
