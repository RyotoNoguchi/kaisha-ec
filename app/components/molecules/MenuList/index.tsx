import { Link } from '@remix-run/react'
import type { GetRecommendedCollectionQuery } from 'src/gql/graphql'
import { MenuCard } from '~/components/molecules/MenuCard'

type Props = {
  collection: GetRecommendedCollectionQuery['collection']
}

export const MenuList: React.FC<Props> = ({ collection }) => {
  const variantsNodes = collection?.products.nodes.map((product) => product.variants.nodes)
  return (
    <div className='w-full flex flex-col gap-9 p-9 bg-beige'>
      <h2 className='text-2xl font-yumincho font-bold whitespace-nowrap'>{collection?.title}</h2>
      <ul className='w-full flex gap-8 overflow-x-auto whitespace-nowrap'>{variantsNodes && variantsNodes.map((variants) => <MenuCard key={variants[0].id} variant={variants[0]} />)}</ul>
      <Link to='/products' className='flex justify-center hover:opacity-50 transition-all ease-in-out duration-300'>
        <button className='px-6 md:px-10 bg-primary h-14 rounded-full font-yumincho font-bold text-center text-xl md:text-2xl'>メニュー一覧</button>
      </Link>
    </div>
  )
}
