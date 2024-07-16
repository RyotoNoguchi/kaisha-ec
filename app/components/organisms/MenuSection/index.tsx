import React from 'react'
import type { GetRecommendedCollectionQuery } from 'src/gql/graphql'
import { MenuList } from '~/components/molecules/MenuList'

type Props = {
  collection: GetRecommendedCollectionQuery['collection']
}

export const MenuSection: React.FC<Props> = ({ collection }) => {
  return <div className='w-full flex flex-col md:p-16 gap-8 md:gap-28'>{collection && <MenuList collection={collection} />}</div>
}
