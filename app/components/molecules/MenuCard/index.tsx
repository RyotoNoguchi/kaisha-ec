import { AddToCartButton, ProductProvider } from '@shopify/hydrogen-react'
import { Product } from '@shopify/hydrogen-react/storefront-api-types'
import React from 'react'

type Props = {
  product: Partial<Product>
}

export const MenuCard: React.FC<Props> = ({ product }) => {
  return (
    <ProductProvider data={product}>
      <li className='w-56 flex flex-shrink-0 flex-col gap-4 p-4 bg-black mb-2'>
        {/* eslint-disable-next-line hydrogen/prefer-image-component */}
        <img src={product.images?.nodes[0].url} alt='bento' className='w-full' />
        <h3 className='text-secondary font-yumincho'>{product.title}</h3>
        <div className='flex justify-between items-end'>
          <div className='flex '>
            <p className='text-primary text-xl font-bold font-yumincho'>
              {product.priceRange?.minVariantPrice.amount}
              {product.priceRange?.minVariantPrice.currencyCode}
            </p>
          </div>
          {/* <Button text='予約' fontWeight='extrabold' /> */}
          <AddToCartButton variantId={product.variants?.nodes[0].id} className='text-white'>
            予約
          </AddToCartButton>
        </div>
      </li>
    </ProductProvider>
  )
}
