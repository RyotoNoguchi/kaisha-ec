import React from 'react'

type Props = {
  deliveryOption: 'pickup' | 'shipping'
  setDeliveryOption: (deliveryOption: 'pickup' | 'shipping') => void
  clearPickupDateAndTime: () => void
}

export const DeliveryOptionRadioButtons: React.FC<Props> = ({ deliveryOption, setDeliveryOption, clearPickupDateAndTime }) => {
  return (
    <div className='flex justify-end items-end flex-col gap-2'>
      <label className='flex items-center gap-2'>
        <input
          className='cursor-pointer'
          role='button'
          type='radio'
          name='deliveryOption'
          value='pickup'
          checked={deliveryOption === 'pickup'}
          onChange={() => setDeliveryOption('pickup')}
          onClick={clearPickupDateAndTime}
        />
        <span className='w-36 text-right'>店舗受取を希望する</span>
      </label>
      <label className='flex items-center gap-2'>
        <input
          className='cursor-pointer'
          role='button'
          type='radio'
          name='deliveryOption'
          value='shipping'
          checked={deliveryOption === 'shipping'}
          onChange={() => setDeliveryOption('shipping')}
          onClick={clearPickupDateAndTime}
        />
        <span className='w-36 text-right'>配送を希望する</span>
      </label>
    </div>
  )
}
