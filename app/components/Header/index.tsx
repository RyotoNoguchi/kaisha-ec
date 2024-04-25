import { NavLink } from '@remix-run/react'
import { HeaderMenu } from 'app/components/Header/HeaderMenu'
import type { LayoutProps } from 'app/components/Layout'
import { HeaderCallToActions } from './HeaderCallToActions'

type Props = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>

export const Header: React.FC<Props> = ({ header, cart, isLoggedIn }) => {
  const { shop, menu } = header
  return (
    <header className='header'>
      <NavLink prefetch='intent' to='/' end>
        <strong>{shop.name}</strong>
      </NavLink>
      <HeaderMenu menu={menu} viewport='desktop' primaryDomainUrl={header.shop.primaryDomain.url} />
      <HeaderCallToActions isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  )
}
