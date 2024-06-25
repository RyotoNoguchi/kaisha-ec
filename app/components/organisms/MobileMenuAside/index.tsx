import type { HeaderQuery } from 'storefrontapi.generated'
import { Aside } from '~/components/Aside'
import { CloseIcon } from '~/components/atoms/CloseIcon'
import { HeaderMenu } from '~/components/Header/HeaderMenu'

type Props = {
  menu: HeaderQuery['menu']
  shop: HeaderQuery['shop']
  setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void
}

export const MobileMenuAside: React.FC<Props> = ({ menu, shop, setIsMobileMenuOpen }) => {
  const handleClose = () => {
    window.location.href = window.location.href.replace('mobile-menu-aside', '')
    setIsMobileMenuOpen(false)
  }
  return (
    menu &&
    shop?.primaryDomain?.url && (
      <Aside id='mobile-menu-aside' heading='MENU' setIsMobileMenuOpen={setIsMobileMenuOpen}>
        <button className='' type='button' onClick={handleClose}>
          <CloseIcon width={48} height={48} strokeWidth={4} withBorder={false} />
        </button>
        <HeaderMenu menu={menu} viewport='mobile' primaryDomainUrl={shop.primaryDomain.url} />
      </Aside>
    )
  )
}
