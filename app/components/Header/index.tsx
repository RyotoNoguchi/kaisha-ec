import { NavLink } from '@remix-run/react'
import { HeaderMenu } from 'app/components/Header/HeaderMenu'
import type { LayoutProps } from 'app/components/Layout'
import '../../styles/tailwind.css'
import { HeaderCallToActions } from './HeaderCallToActions'

type Props = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'> & {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void
}

export const Header: React.FC<Props> = ({ header, cart, isLoggedIn, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { menu } = header
  return (
    <header className='bg-black text-white header md:py-3 px-3 md:px-3 lg:px-10 w-full justify-between z-40 font-yumincho flex'>
      <NavLink prefetch='intent' to='/' end className='min-w-[200px]'>
        <div className='flex flex-1'>
          {/* eslint-disable-next-line hydrogen/prefer-image-component */}
          <img src='/image/kaysha-logo.webp' alt='logo' className='w-full h-16 py-3' />
        </div>
      </NavLink>
      <div className='hidden md:flex w-full'>
        <HeaderMenu menu={menu} viewport='desktop' primaryDomainUrl={header.shop.primaryDomain.url} />
      </div>
      <HeaderCallToActions isLoggedIn={isLoggedIn} cart={cart} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
    </header>
  )
}
