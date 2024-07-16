import { Await, Link } from '@remix-run/react'
import { Suspense } from 'react'
import type { CartApiQueryFragment } from 'storefrontapi.generated'
import { CartIcon } from '~/components/atoms/CartIcon'
import { HamburgerMenuIcon } from '~/components/atoms/HamburgerMenu'
import { colors } from '~/styles/colors'

type Props = {
  isLoggedIn: Promise<boolean>
  cart: Promise<CartApiQueryFragment | null>
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void
}

export const HeaderCallToActions: React.FC<Props> = ({ isLoggedIn, cart, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <nav className='flex' role='navigation'>
      {!isMobileMenuOpen && <HeaderMenuMobileToggle isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />}
      <CartToggle cart={cart} />
    </nav>
  )
}

const HeaderMenuMobileToggle: React.FC<{ isMobileMenuOpen: boolean; setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void }> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => (
  <button className='flex md:hidden' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
    <HamburgerMenuIcon color={colors.white} />
  </button>
)

const CartBadge: React.FC<{ count: number }> = ({ count }) => (
  <Link to='/cart' className='hover:opacity-70 transition-opacity duration-200'>
    <CartIcon />
  </Link>
)

const CartToggle: React.FC<Pick<Props, 'cart'>> = ({ cart }) => (
  <Suspense fallback={<CartBadge count={0} />}>
    <Await resolve={cart}>
      {(cart) => {
        if (!cart) return <CartBadge count={1} />
      }}
    </Await>
  </Suspense>
)
