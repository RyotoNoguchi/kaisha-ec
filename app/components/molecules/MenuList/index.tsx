import { Product } from '@shopify/hydrogen-react/storefront-api-types'
import { MenuCard } from '~/components/molecules/MenuCard'

type Props = {
  title: string
  products: Partial<Product>[]
}

export const MenuList: React.FC<Props> = ({ title, products }) => {
  return (
    <div className='w-full flex flex-col gap-9 p-9 bg-beige'>
      <h2 className='text-2xl font-yumincho font-bold whitespace-nowrap'>{title}</h2>
      <ul className='w-full flex gap-8 overflow-x-auto whitespace-nowrap'>
        {products.map((product) => (
          <MenuCard key={product.id} product={product} />
        ))}
      </ul>
      <div className='flex justify-center'>
        <button className='px-11 bg-primary h-16 rounded-full font-yumincho font-bold text-center text-2xl'>メニュー一覧</button>
      </div>
    </div>
  )
}
