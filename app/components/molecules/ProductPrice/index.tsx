import { Money } from '@shopify/hydrogen'
import type { ProductFragment } from 'storefrontapi.generated'

type Props = {
  selectedVariant: ProductFragment['selectedVariant']
}

export const ProductPrice: React.FC<Props> = ({ selectedVariant }) => (
  <div className='product-price'>
    {selectedVariant?.compareAtPrice ? (
      <>
        <p>Sale</p>
        <br />
        <div className='product-price-on-sale'>
          {selectedVariant ? <Money data={selectedVariant.price} /> : null}
          <s>
            <Money data={selectedVariant.compareAtPrice} />
          </s>
        </div>
      </>
    ) : (
      selectedVariant?.price && <Money data={selectedVariant?.price} />
    )}
  </div>
)
