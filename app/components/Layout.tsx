import { Await } from '@remix-run/react'
import { Header } from 'app/components/Header/index'
import { Suspense, useState } from 'react'
import type { GetHeaderMenusQuery } from 'src/gql/graphql'
import type { CartApiQueryFragment, FooterQuery, HeaderQuery } from 'storefrontapi.generated'
import { Footer } from '~/components/Footer'
import { MobileMenuAside } from '~/components/organisms/MobileMenuAside'

export type Props = {
  logoUrl: string
  cart: Promise<CartApiQueryFragment | null>
  children?: React.ReactNode
  footer: Promise<FooterQuery>
  header: HeaderQuery
  headerMenus: GetHeaderMenusQuery['menu']
  isLoggedIn: Promise<boolean>
}

export const Layout: React.FC<Props> = ({ cart, children = null, footer, header, isLoggedIn, logoUrl, headerMenus }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileHeaderMenus = headerMenus
    ? {
        ...headerMenus,
        items: headerMenus.items.filter((item) => item.url && !item.url.includes('#'))
      }
    : null

  return (
    <>
      {headerMenus && <MobileMenuAside headerMenus={mobileHeaderMenus} shop={header?.shop} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />}
      {header && (
        <Header headerMenus={headerMenus} header={header} cart={cart} isLoggedIn={isLoggedIn} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} logoUrl={logoUrl} />
      )}
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>{(footer) => <Footer menu={footer?.menu} shop={header?.shop} />}</Await>
      </Suspense>
    </>
  )
}
