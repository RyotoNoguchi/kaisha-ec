import { Link } from '@remix-run/react'
import { AddToCartButton, Image, ProductProvider } from '@shopify/hydrogen-react'
import { Product } from '@shopify/hydrogen-react/storefront-api-types'
import React from 'react'

type Props = {
  product: Partial<Product>
}

export const MenuCard: React.FC<Props> = ({ product }) => {
  return (
    <ProductProvider data={product}>
      <Link to={`/products/${product.handle}`}>
        <li className='w-56 flex flex-shrink-0 flex-col gap-4 p-4 bg-black mb-2 rounded-sm'>
          <Image data={product.images?.nodes[0]} alt='product image' className='rounded-sm' />
          <div className='flex flex-col gap-3 flex-1 min-h-24'>
            <h3 className='text-primary font-yumincho break-words whitespace-normal'>{product.title}</h3>
            <div className='flex justify-between items-end flex-1'>
              <div className='flex'>
                <p className='text-primary text-xl font-semibold font-yumincho'>
                  {product.priceRange?.minVariantPrice.amount}
                  {product.priceRange?.minVariantPrice.currencyCode}
                </p>
              </div>
              <AddToCartButton variantId={product.variants?.nodes[0].id} className='text-black bg-primary px-2 py-1 rounded-full font-yumincho text-lg font-semibold'>
                予約
              </AddToCartButton>
            </div>
          </div>
        </li>
      </Link>
    </ProductProvider>
  )
}
