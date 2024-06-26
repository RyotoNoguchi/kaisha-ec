import { NavLink } from '@remix-run/react'
import type { HeaderQuery } from 'storefrontapi.generated'
import { useRootLoaderData } from '~/root'

type Props = {
  menu: HeaderQuery['menu']
  viewport: 'desktop' | 'mobile'
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url']
}

export const HeaderMenu: React.FC<Props> = ({ menu, primaryDomainUrl, viewport }) => {
  const { publicStoreDomain } = useRootLoaderData()
  const className = `header-menu-${viewport}`

  const closeAside = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (viewport === 'mobile') {
      event.preventDefault()
      window.location.href = event.currentTarget.href
    }
  }
  return (
    <nav className='md:flex w-full' role='navigation'>
      {/*TODO (menu || FALLBACK_HEADER_MENU)に戻す */}
      <ul className='flex flex-col flex-1 md:flex-row md:justify-evenly lg:justify-center  gap-4 md:gap-2 lg:gap-4 w-full md:px-4'>
        <NavLink end onClick={closeAside} prefetch='intent' style={activeLinkStyle} to='/'>
          Home
        </NavLink>
        {FALLBACK_HEADER_MENU.items.map((item) => {
          if (!item.url) return null
          const url = item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain) || item.url.includes(primaryDomainUrl) ? new URL(item.url).pathname : item.url
          return (
            <NavLink className='text-black md:text-white' end key={item.id} onClick={closeAside} prefetch='intent' style={activeLinkStyle} to={url}>
              {item.title}
            </NavLink>
          )
        })}
      </ul>
    </nav>
  )
}

const activeLinkStyle = ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) => {
  const isMobile = window.innerWidth <= 768 // モバイルサイズの判定
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'gray' : isMobile ? 'black' : 'white'
  }
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: '商品一覧',
      type: 'HTTP',
      url: '/products',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'カート',
      type: 'HTTP',
      url: '/cart',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'ブログ',
      type: 'HTTP',
      url: '/blog',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: '店舗案内',
      type: 'PAGE',
      url: '/shop-info',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461609599033',
      resourceId: 'gid://shopify/Page/92591030329',
      tags: [],
      title: 'アクセス',
      type: 'PAGE',
      url: '/access',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461609599035',
      resourceId: 'gid://shopify/Page/92591030329',
      tags: [],
      title: '店主の思い',
      type: 'PAGE',
      url: '/about-us',
      items: []
    }
  ]
}
