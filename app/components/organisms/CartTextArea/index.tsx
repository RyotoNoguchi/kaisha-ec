import React from 'react'

type Props = {
  customerNote: string
  setCustomerNote: React.Dispatch<React.SetStateAction<string>>
}

export const CartTextArea: React.FC<Props> = ({ customerNote, setCustomerNote }) => {
  return (
    <div className='flex flex-col gap-1'>
      <label htmlFor='customerNote' className='text-xs'>
        ご注文に伴うご要望がございましたら、こちらにご記入ください
      </label>
      <textarea
        name='customerNote'
        id='customerNote'
        className='border border-gray-300 bg-slate-200 rounded-md text-black p-2 text-xs'
        value={customerNote}
        onChange={(e) => setCustomerNote(e.target.value)}
        placeholder='特別な要望があればこちらに記入してください'
      />
    </div>
  )
}
