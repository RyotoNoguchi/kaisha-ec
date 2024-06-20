import { AddToCartButton, Image, Money, ProductProvider } from '@shopify/hydrogen-react'
import type { MoneyV2, Product, Image as StorefrontApiImage } from '@shopify/hydrogen/storefront-api-types'
import React from 'react'
// import { Button } from '~/components/atoms/Button'

type Props = {
  product: Pick<Product, 'title' | 'id' | 'handle'> & {
    priceRange: {
      minVariantPrice: Pick<MoneyV2, 'amount' | 'currencyCode'>
    }
    images: {
      nodes: Pick<StorefrontApiImage, 'id' | 'altText' | 'height' | 'url' | 'width'>[]
    }
    // variants: {
    //   nodes: {
    //     id: string
    //     // selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>
    //   }
    // }
  }
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  //   const variantId = product.variants.nodes.id
  return (
    <ProductProvider data={product}>
      <li className='w-56 flex flex-shrink-0 flex-col gap-4 p-4 bg-black mb-2'>
        <Image data={product.images.nodes[0]} aspectRatio='1/1' sizes='(min-width: 45em) 20vw, 50vw' />
        <h3 className='text-secondary font-yumincho'>{product.title}</h3>
        <div className='flex justify-between items-end'>
          <div className='flex text-primary'>
            <Money data={product.priceRange.minVariantPrice} />
          </div>
          {/* <Button text='予約' fontWeight='extrabold' /> */}
          <div className='text-primary'>
            <AddToCartButton>予約</AddToCartButton>
          </div>
        </div>
      </li>
    </ProductProvider>
  )
}
