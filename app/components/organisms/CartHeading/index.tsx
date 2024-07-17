import { Link } from '@remix-run/react'

export const CartHeading: React.FC = () => (
  <div className='flex justify-between items-end'>
    <h1 className='flex text-4xl font-bold'>ご注文内容</h1>
    <div className='flex gap-2 font-semibold'>
      <Link to='/products' className='flex hover:opacity-70 transition-opacity duration-200'>
        他の商品も見る
      </Link>
    </div>
  </div>
)
