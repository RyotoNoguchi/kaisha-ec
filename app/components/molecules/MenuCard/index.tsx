import { Link } from '@remix-run/react'
import { AddToCartButton, Image, ProductProvider } from '@shopify/hydrogen-react'
import React from 'react'
import type { AllProductsQuery } from 'src/gql/graphql'
import { AddToCartIcon } from '~/components/atoms/AddToCartIcon'

type Props = {
  variant: AllProductsQuery['products']['nodes'][0]['variants']['nodes'][0]
}

export const MenuCard: React.FC<Props> = ({ variant }) => {
  const hasVariants = variant.selectedOptions.some((option) => option.name !== 'Title' && option.value !== 'Default Title')
  const queryParams = variant.selectedOptions.map((option) => `${option.name}=${option.value}`).join('&')
  return (
    <ProductProvider data={variant.product}>
      <Link to={hasVariants ? `/products/${variant.product.handle}?${queryParams}` : `/products/${variant.product.handle}`}>
        <li className='w-56 flex flex-shrink-0 flex-col gap-4 p-4 bg-black mb-2 rounded-sm'>
          {variant.image && <Image data={variant.image} alt='product image' className='rounded-sm' />}
          <div className='flex flex-col gap-2 flex-1 min-h-24'>
            <div className='text-primary font-yumincho'>
              <h3 className='truncate'>{variant.product.title}</h3>
              {hasVariants && (
                <div className='flex flex-col'>
                  {variant.selectedOptions.map((option, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <p key={index} className='text-xs'>
                      {option.name}: {option.value}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className='flex justify-between items-end flex-1'>
              <div className='flex'>
                <p className='text-primary text-xl font-semibold font-yumincho'>
                  {variant.product.priceRange?.minVariantPrice.amount}
                  {variant.product.priceRange?.minVariantPrice.currencyCode}
                </p>
              </div>
              {variant.availableForSale && (
                <AddToCartButton variantId={variant.id} className='text-black bg-primary px-3 py-1 rounded-full font-yumincho text-lg font-semibold'>
                  <AddToCartIcon />
                </AddToCartButton>
              )}
            </div>
          </div>
        </li>
      </Link>
    </ProductProvider>
  )
}
