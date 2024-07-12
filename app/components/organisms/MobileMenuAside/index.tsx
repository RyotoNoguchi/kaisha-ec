import type { GetHeaderMenusQuery } from 'src/gql/graphql'
import type { HeaderQuery } from 'storefrontapi.generated'
import { Aside } from '~/components/Aside'
import { HeaderMenu } from '~/components/Header/HeaderMenu'

type Props = {
  headerMenus: GetHeaderMenusQuery['menu']
  shop: HeaderQuery['shop']
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void
}

export const MobileMenuAside: React.FC<Props> = ({ headerMenus, shop, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    headerMenus &&
    shop?.primaryDomain?.url && (
      <Aside heading='MENU' isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}>
        <div className='flex justify-start pt-4'>
          <HeaderMenu headerMenus={headerMenus} viewport='mobile' primaryDomainUrl={shop.primaryDomain.url} />
        </div>
      </Aside>
    )
  )
}
