type Props = {
  subtotalAmount: string
  totalAmount: string
}

export const CartAmountTotal: React.FC<Props> = ({ subtotalAmount, totalAmount }) => {
  return (
    <div className='flex flex-col gap-2 items-end'>
      <p className='flex gap-2 text-lg font-bold'>
        <span className=''>小計</span>
        <span className=''>{subtotalAmount}円</span>
      </p>
      <p className='flex gap-2'>
        <span className='text-lg font-bold'>合計</span>
        <span className='text-xl font-extrabold text-crimsonRed'>{totalAmount}円</span>
      </p>
    </div>
  )
}
