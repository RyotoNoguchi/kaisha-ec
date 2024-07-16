import { Typography } from '@material-tailwind/react'
import { Link } from '@remix-run/react'
import { Image } from '@shopify/hydrogen-react'

type Props = {
  products: {
    id: string
    title: string
    handle: string
    imageUrl: string
  }[]
}

export const CrossSellProductList: React.FC<Props> = ({ products }) => {
  return (
    <div className='flex flex-col gap-4 lg:px-10'>
      <Typography variant='h4' color='black' className='font-semibold text-xl md:text-2xl'>
        ご一緒にいかがですか？
      </Typography>
      <ul className='flex flex-row p-0 gap-6 list-none w-full overflow-x-auto whitespace-nowrap'>
        {products.map((product) => {
          return (
            <li key={product.id} className='max-w-[200px] hover:opacity-70 transition-opacity duration-200'>
              <Link to={`/products/${product.handle}`} className='flex flex-col gap-2'>
                <div className='w-[200px] h-[160px] overflow-hidden'>
                  <Image src={product.imageUrl} alt={product.title} className='object-cover w-full h-full' />
                </div>
                <p className='text-left truncate whitespace-pre-wrap'>{product.title}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default CrossSellProductList
