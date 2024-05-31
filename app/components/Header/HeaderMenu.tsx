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
    <nav className={`${className} hidden lg:flex`} role='navigation'>
      <NavLink end onClick={closeAside} prefetch='intent' style={activeLinkStyle} to='/'>
        Home
      </NavLink>
      {/*TODO (menu || FALLBACK_HEADER_MENU)に戻す */}
      {FALLBACK_HEADER_MENU.items.map((item) => {
        if (!item.url) return null
        const url = item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain) || item.url.includes(primaryDomainUrl) ? new URL(item.url).pathname : item.url
        return (
          <NavLink className='header-menu-item' end key={item.id} onClick={closeAside} prefetch='intent' style={activeLinkStyle} to={url}>
            {item.title}
          </NavLink>
        )
      })}
    </nav>
  )
}

const activeLinkStyle = ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) => {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white'
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
      url: '/product-list',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'ご予約',
      type: 'HTTP',
      url: '/reservation',
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
