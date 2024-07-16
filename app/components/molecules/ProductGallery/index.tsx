import { Image } from '@shopify/hydrogen'
import React, { useEffect, useState } from 'react'
import type { ProductFragment, ProductVariantFragment } from 'src/gql/graphql'

type Props = {
  product: ProductFragment & { selectedVariant: ProductVariantFragment }
}

const ProductGallery: React.FC<Props> = ({ product }) => {
  const [mainImage, setMainImage] = useState(product.featuredImage?.url)

  useEffect(() => {
    setMainImage(product.featuredImage?.url)
  }, [product])

  return (
    <div className='w-full flex flex-col flex-shrink-0 relative gap-4 flex-1 sm:aspect-square justify-start items-center'>
      <Image src={mainImage} alt={product.title} className='w-full h-full object-cover sm:max-w-96 sm:max-h-96 flex-1' />
      <div className='w-full flex justify-start px-4 lg:px-6'>
        <ul className='w-full gap-8 flex overflow-x-auto whitespace-nowrap'>
          {product?.images?.edges &&
            product.images.edges.map((image: { node: { url?: any; altText: string | null; id: string | null } }) => (
              <li key={image.node.id} className='cursor-pointer'>
                {image.node.url && (
                  <button className='w-36 hover:opacity-70 transition-opacity duration-200' onClick={() => setMainImage(image.node.url)}>
                    <Image src={image.node.url} alt={product.title} className='w-36' />
                  </button>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default ProductGallery
