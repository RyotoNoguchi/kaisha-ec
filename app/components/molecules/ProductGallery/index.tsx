import { Image } from '@shopify/hydrogen'
import React from 'react'
import type { ProductFragment, ProductVariantFragment } from 'src/gql/graphql'

type Props = {
  product: ProductFragment & { selectedVariant: ProductVariantFragment }
  selectedImage: { altText: string; id: string; url: URL }
  handleImageClick: (image: { altText: string; id: string; url: URL }) => void
}

const ProductGallery: React.FC<Props> = ({ product, selectedImage, handleImageClick }) => {
  return (
    <div className='flex flex-col relative gap-4 flex-1 sm:aspect-square justify-start items-center'>
      <Image
        data={{ ...product?.selectedVariant?.image, altText: selectedImage.altText, id: selectedImage.id, url: selectedImage.url.toString() }}
        className='w-full h-full object-cover sm:max-w-96 sm:max-h-96 flex-1'
      />
      <ul className='w-full gap-8 overflow-x-auto whitespace-nowrap px-4 lg:px-10 xl:px-24 hidden sm:flex'>
        {product?.images?.edges &&
          product.images.edges.map((image: { node: { url?: any; altText: string | null; id: string | null } }) => (
            <li key={image.node.id} className='cursor-pointer'>
              {image.node.url && (
                <Image
                  data={{ url: image.node.url as string, altText: image.node.altText ?? '', id: image.node.id ?? '' }}
                  className='w-full h-full max-w-20 max-h-20'
                  onClick={() => handleImageClick({ altText: image.node.altText ?? '', id: image.node.id ?? '', url: new URL(image.node.url) })}
                />
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default ProductGallery
