import { Await } from '@remix-run/react'
import { Suspense } from 'react'
import type { CartApiQueryFragment } from 'storefrontapi.generated'
import { Aside } from '~/components/Aside'
import { CartMain } from '~/components/Cart'

type Props = {
  cart: Promise<CartApiQueryFragment | null>
}

export const CartAside: React.FC<Props> = ({ cart }) => {
  return (
    <Aside id='cart-aside' heading='CART'>
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout='aside' />
          }}
        </Await>
      </Suspense>
    </Aside>
  )
}
