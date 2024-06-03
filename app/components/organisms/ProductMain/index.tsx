import { Await } from '@remix-run/react'
import { Suspense } from 'react'
import type { ProductFragment, ProductVariantsQuery } from 'storefrontapi.generated'
import { ProductForm } from '~/components/molecules/ProductForm'
import { ProductPrice } from '~/components/molecules/ProductPrice'

type Props = { product: ProductFragment; selectedVariant: ProductFragment['selectedVariant']; variants: Promise<ProductVariantsQuery> }

export const ProductMain: React.FC<Props> = ({ selectedVariant, product, variants }) => {
  const { title, descriptionHtml } = product
  return (
    <div className='product-main'>
      <h1>{title}</h1>
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <Suspense fallback={<ProductForm product={product} selectedVariant={selectedVariant} variants={[]} />}>
        <Await errorElement='There was a problem loading product variants' resolve={variants}>
          {(data) => <ProductForm product={product} selectedVariant={selectedVariant} variants={data.product?.variants.nodes || []} />}
        </Await>
      </Suspense>
      <br />
      <br />
      <p>
        <strong>Description</strong>
      </p>
      <br />
      <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
      <br />
    </div>
  )
}
