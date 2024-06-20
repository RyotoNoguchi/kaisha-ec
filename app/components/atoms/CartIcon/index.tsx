import { useCart } from '@shopify/hydrogen-react'

export const CartIcon = () => {
  const cart = useCart()
  const totalQuantity = cart?.lines?.reduce((acc, item) => acc + (item?.quantity ?? 0), 0) ?? 0
  return (
    <div className='relative'>
      <svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='10' y='14' width='28' height='24' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M16 14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
      <div className='absolute bottom-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center'>
        <span className='text-xs font-bold text-white'>{totalQuantity}</span>
      </div>
    </div>
  )
}
