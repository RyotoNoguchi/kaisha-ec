import React from 'react'
import type { AllProductsQuery, GetRecommendedCollectionQuery } from 'src/gql/graphql'
import { MenuList } from '~/components/molecules/MenuList'

type Props = {
  products: AllProductsQuery['products']['nodes']
  collection: GetRecommendedCollectionQuery['collection']
}

export const MenuSection: React.FC<Props> = ({ products, collection }) => {
  return <div className='w-full flex flex-col md:p-16 gap-8 md:gap-28'>{collection && <MenuList title={collection.title} products={products} collection={collection} />}</div>
}
