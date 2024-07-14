import { Await } from '@remix-run/react'
import { Header } from 'app/components/Header/index'
import { Suspense, useState } from 'react'
import type { GetFooterMenusQuery, GetHeaderMenusQuery, GetSocialMediasQuery } from 'src/gql/graphql'
import type { CartApiQueryFragment, HeaderQuery } from 'storefrontapi.generated'
import { Footer } from '~/components/Footer'
import { MobileMenuAside } from '~/components/organisms/MobileMenuAside'

export type Props = {
  logoUrl: string
  cart: Promise<CartApiQueryFragment | null>
  children?: React.ReactNode
  footer: Promise<GetFooterMenusQuery>
  socialMedias: Promise<GetSocialMediasQuery>
  header: HeaderQuery
  headerMenus: GetHeaderMenusQuery['menu']
  isLoggedIn: Promise<boolean>
}

export const Layout: React.FC<Props> = ({ cart, children = null, footer, header, isLoggedIn, logoUrl, headerMenus, socialMedias }) => {
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
        <Await resolve={Promise.all([footer, socialMedias])}>
          {([footer, socialMedias]) => {
            return <Footer footerMenus={footer?.menu} shop={header?.shop} socialMedias={socialMedias?.menu} logoUrl={logoUrl} />
          }}
        </Await>
      </Suspense>
    </>
  )
}
