import { Await } from '@remix-run/react'
import { Suspense } from 'react'
import type { RecommendedProductsQuery } from 'storefrontapi.generated'
import { ProductCard } from '~/components/molecules/ProductCard'

type Props = {
  products: Promise<RecommendedProductsQuery>
}

export const RecommendedMenu: React.FC<Props> = ({ products }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={products}>
        {({ products }) => {
          return (
            <div className='w-full flex flex-col md:p-16 gap-8 md:gap-28'>
              {products.nodes.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        }}
      </Await>
    </Suspense>
  )
}
