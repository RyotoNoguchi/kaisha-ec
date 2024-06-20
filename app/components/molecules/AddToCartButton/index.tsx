import type { FetcherWithComponents } from '@remix-run/react'
import { CartForm } from '@shopify/hydrogen'
import type { CartLineInput } from '@shopify/hydrogen/storefront-api-types'

type Props = {
  analytics?: unknown
  children: React.ReactNode
  disabled?: boolean
  lines: CartLineInput[]
  onClick?: () => void
}

export const AddToCartButton: React.FC<Props> = ({ analytics, children, disabled, lines, onClick }) => (
  <CartForm route='/cart' inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
    {(fetcher: FetcherWithComponents<any>) => (
      <>
        <input name='analytics' type='hidden' value={JSON.stringify(analytics)} />
        <button type='submit' onClick={onClick} disabled={disabled ?? fetcher.state !== 'idle'}>
          {children}
        </button>
      </>
    )}
  </CartForm>
)
