import { Await } from '@remix-run/react'
import { Suspense } from 'react'
import type { CartApiQueryFragment } from 'storefrontapi.generated'
import { CartIcon } from '~/components/atoms/CartIcon'
import { HamburgerMenuIcon } from '~/components/atoms/HamburgerMenu'
import { colors } from '~/styles/colors'

type Props = {
  isLoggedIn: Promise<boolean>
  cart: Promise<CartApiQueryFragment | null>
}

export const HeaderCallToActions: React.FC<Props> = ({ isLoggedIn, cart }) => {
  return (
    <nav className='flex' role='navigation'>
      {/* <HeaderMenuMobileToggle /> */}
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

const HeaderMenuMobileToggle: React.FC = () => (
  <a className='header-menu-mobile-toggle flex lg:hidden' href='#mobile-menu-aside'>
    <HamburgerMenuIcon color={colors.white} />
  </a>
)

// const SearchToggle: React.FC = () => <a href='#search-aside'>Search</a>

// const CartBadge: React.FC<{ count: number }> = ({ count }) => <a href='#cart-aside'>Cart {count}</a>
const CartBadge: React.FC<{ count: number }> = ({ count }) => (
  <a href='#cart-aside'>
    <CartIcon />
  </a>
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
