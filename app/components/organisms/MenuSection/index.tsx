import React from 'react'
import type { AllProductsQuery } from 'src/gql/graphql'
import { MenuList } from '~/components/molecules/MenuList'

type Props = {
  products: AllProductsQuery['products']['nodes']
}

export const MenuSection: React.FC<Props> = ({ products }) => {
  return (
    <div className='w-full flex flex-col md:p-16 gap-8 md:gap-28'>
      <MenuList title='ピックアップ' products={products} />
    </div>
  )
}
