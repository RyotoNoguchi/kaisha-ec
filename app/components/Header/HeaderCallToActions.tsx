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
      {/* <NavLink prefetch='intent' to='/account' style={activeLinkStyle}>
        <Suspense fallback='Sign in'>
          <Await resolve={isLoggedIn} errorElement='Sign in'>
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle /> */}
      <CartToggle cart={cart} />
    </nav>
  )
}

const HeaderMenuMobileToggle: React.FC<{ isMobileMenuOpen: boolean; setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void }> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => (
  <a className='flex lg:hidden' href='#mobile-menu-aside' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
    <HamburgerMenuIcon color={colors.white} />
  </a>
)

// const SearchToggle: React.FC = () => <a href='#search-aside'>Search</a>

const CartBadge: React.FC<{ count: number }> = ({ count }) => (
  <Link to='/cart'>
    <CartIcon />
  </Link>
)

// TODO Implement cart icon with count
const CartToggle: React.FC<Pick<Props, 'cart'>> = ({ cart }) => (
  <Suspense fallback={<CartBadge count={0} />}>
    <Await resolve={cart}>
      {(cart) => {
        if (!cart) return <CartBadge count={1} />
      }}
    </Await>
  </Suspense>
)

const activeLinkStyle = ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) => {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black'
  }
}
