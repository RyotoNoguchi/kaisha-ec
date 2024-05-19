import { NavLink } from '@remix-run/react'
import { HeaderMenu } from 'app/components/Header/HeaderMenu'
import type { LayoutProps } from 'app/components/Layout'
import '../../styles/tailwind.css'
import { HeaderCallToActions } from './HeaderCallToActions'

type Props = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>

export const Header: React.FC<Props> = ({ header, cart, isLoggedIn }) => {
  const { menu } = header
  return (
    <header className='bg-black text-white header py-3 px-20 w-full'>
      <NavLink prefetch='intent' to='/' end>
        <div className=''>
          {/* eslint-disable-next-line hydrogen/prefer-image-component */}
          <img src='/image/kaysha-logo.webp' alt='logo' className='w-full h-16 py-3' />
        </div>
      </NavLink>
      <HeaderMenu menu={menu} viewport='desktop' primaryDomainUrl={header.shop.primaryDomain.url} />
      <HeaderCallToActions isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  )
}
