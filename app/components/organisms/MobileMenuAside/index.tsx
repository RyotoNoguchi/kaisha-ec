import type { HeaderQuery } from 'storefrontapi.generated'
import { Aside } from '~/components/Aside'
import { HeaderMenu } from '~/components/Header/HeaderMenu'

type Props = {
  menu: HeaderQuery['menu']
  shop: HeaderQuery['shop']
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void
}

export const MobileMenuAside: React.FC<Props> = ({ menu, shop, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    menu &&
    shop?.primaryDomain?.url && (
      <Aside heading='MENU' isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}>
        <div className='flex justify-start pt-4'>
          <HeaderMenu menu={menu} viewport='mobile' primaryDomainUrl={shop.primaryDomain.url} />
        </div>
      </Aside>
    )
  )
}
