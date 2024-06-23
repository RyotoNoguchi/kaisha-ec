import { Link } from '@remix-run/react'
import type { AllProductsQuery } from 'src/gql/graphql'
import { MenuCard } from '~/components/molecules/MenuCard'

type Props = {
  title: string
  products: AllProductsQuery['products']['nodes']
}

export const MenuList: React.FC<Props> = ({ title, products }) => {
  const productVariants = products.flatMap((product) => product.variants.nodes)
  return (
    <div className='w-full flex flex-col gap-9 p-9 bg-beige'>
      <h2 className='text-2xl font-yumincho font-bold whitespace-nowrap'>{title}</h2>
      <ul className='w-full flex gap-8 overflow-x-auto whitespace-nowrap'>
        {productVariants.map((variant) => (
          <MenuCard key={variant.id} variant={variant} />
        ))}
      </ul>
      <Link to='/products' className='flex justify-center'>
        <button className='px-6 md:px-10 bg-primary h-14 rounded-full font-yumincho font-bold text-center text-xl md:text-2xl'>メニュー一覧</button>
      </Link>
    </div>
  )
}
