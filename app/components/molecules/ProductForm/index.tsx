import { VariantSelector } from '@shopify/hydrogen'
import type { ProductFragment, ProductVariantFragment } from 'storefrontapi.generated'
import { AddToCartButton } from '~/components/molecules/AddToCartButton'
import { ProductOptions } from '~/components/molecules/ProductOptions'

type Props = { product: ProductFragment; selectedVariant: ProductFragment['selectedVariant']; variants: Array<ProductVariantFragment> }

export const ProductForm: React.FC<Props> = ({ product, selectedVariant, variants }) => (
  <div className='product-form'>
    <VariantSelector handle={product.handle} options={product.options} variants={variants}>
      {({ option }) => <ProductOptions key={option.name} option={option} />}
    </VariantSelector>
    <br />
    <AddToCartButton
      disabled={!selectedVariant || !selectedVariant.availableForSale}
      onClick={() => {
        window.location.href = window.location.href + '#cart-aside'
      }}
      lines={
        selectedVariant
          ? [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1
              }
            ]
          : []
      }
    >
      {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
    </AddToCartButton>
  </div>
)
