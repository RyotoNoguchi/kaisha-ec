import { Link } from '@remix-run/react'
import { Image, ProductProvider } from '@shopify/hydrogen-react'
import React from 'react'
import type { AllProductsQuery } from 'src/gql/graphql'

type Props = {
  variant: AllProductsQuery['products']['nodes'][0]['variants']['nodes'][0]
}

export const MenuCard: React.FC<Props> = ({ variant }) => {
  const hasVariants = variant.selectedOptions.some((option) => option.name !== 'Title' && option.value !== 'Default Title')
  const queryParams = variant.selectedOptions.map((option) => `${option.name}=${option.value}`).join('&')
  return (
    <ProductProvider data={variant.product}>
      <li className='hover:opacity-70 transition-opacity duration-200'>
        <Link
          className='w-56 flex flex-shrink-0 flex-col gap-4 p-4 bg-black mb-2 rounded-sm'
          to={hasVariants ? `/products/${variant.product.handle}?${queryParams}` : `/products/${variant.product.handle}`}
        >
          {variant.image && <Image data={variant.image} alt='product image' className='rounded-sm' />}
          <div className='flex flex-col gap-2 flex-1 min-h-24'>
            <div className='text-primary font-yumincho'>
              <h3 className='truncate whitespace-pre-wrap'>{variant.product.title}</h3>
            </div>
            <div className='flex justify-end items-end flex-1'>
              <div className='flex'>
                <p className='text-primary text-xl font-semibold font-yumincho flex gap-0.5'>
                  <span className=''>
                    {Math.floor(variant.product.priceRange?.minVariantPrice.amount).toLocaleString()}
                    {hasVariants && <span>~</span>}
                  </span>
                  <span className=''>{variant.product.priceRange?.minVariantPrice.currencyCode === 'JPY' && '円'}</span>
                </p>
              </div>
            </div>
          </div>
        </Link>
      </li>
    </ProductProvider>
  )
}
