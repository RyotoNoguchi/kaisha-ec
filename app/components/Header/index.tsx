import { NavLink } from '@remix-run/react'
import { Image } from '@shopify/hydrogen-react'
import { HeaderMenu } from 'app/components/Header/HeaderMenu'
import type { Props as LayoutProps } from 'app/components/Layout'
import '../../styles/tailwind.css'
import { HeaderCallToActions } from './HeaderCallToActions'

type Props = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'> & {
  logoUrl: string
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void
}

export const Header: React.FC<Props> = ({ header, cart, isLoggedIn, isMobileMenuOpen, setIsMobileMenuOpen, logoUrl }) => {
  const { menu } = header
  return (
    <header className='bg-black text-white header md:py-3 px-3 md:px-3 lg:px-10 w-full justify-between z-40 font-yumincho flex'>
      <NavLink prefetch='intent' to='/' end className='min-w-[200px]'>
        <div className='flex flex-1'>
          <Image src={logoUrl} alt='logo' width={200} height={64} />
        </div>
      </NavLink>
      <div className='hidden md:flex w-full'>
        <HeaderMenu menu={menu} viewport='desktop' primaryDomainUrl={header.shop.primaryDomain.url} />
      </div>
      <HeaderCallToActions isLoggedIn={isLoggedIn} cart={cart} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
    </header>
  )
}
