import { Await, Link } from '@remix-run/react'
import { Image, Money } from '@shopify/hydrogen'
import { Suspense } from 'react'
import type { RecommendedProductsQuery } from 'storefrontapi.generated'

type Props = {
  products: Promise<RecommendedProductsQuery>
}

export const RecommendedProducts: React.FC<Props> = ({ products }) => {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({ products }) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link key={product.id} className="recommended-product" to={`/products/${product.handle}`}>
                  <Image data={product.images.nodes[0]} aspectRatio="1/1" sizes="(min-width: 45em) 20vw, 50vw" />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  )
}
