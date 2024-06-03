import { NavLink } from '@remix-run/react'
import type { FooterQuery } from 'storefrontapi.generated'
import { useRootLoaderData } from '~/root'

type Props = {
  menu: FooterQuery['menu']
  primaryDomainUrl: string
}

export const FooterMenu: React.FC<Props> = ({ menu, primaryDomainUrl }) => {
  const { publicStoreDomain } = useRootLoaderData()

  const renderLink = (item: { id: string; resourceId?: string; tags?: string[]; title: string; type?: string; url: string; items?: any[] }) => {
    if (!item.url) return null
    const url = item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain) || item.url.includes(primaryDomainUrl) ? new URL(item.url).pathname : item.url
    const isExternal = !url.startsWith('/')
    return isExternal ? (
      <a className='pl-6' href={url} key={item.id} rel='noopener noreferrer' target='_blank'>
        {item.title}
      </a>
    ) : (
      <NavLink className='pl-6' end key={item.id} prefetch='intent' style={activeLinkStyle} to={url}>
        {item.title}
      </NavLink>
    )
  }

  return (
    <nav className='h-full w-full bg-black p-2 md:p-4 font-yumincho' role='navigation'>
      <div className='grid md:grid-cols-3 md:gap-12 p-2 md:p-4 lg:p-1'>
        <div className='flex items-start mb-4 md:mb-0 '>
          {/* eslint-disable-next-line hydrogen/prefer-image-component */}
          <img src='/image/kaysha-logo.webp' alt='logo' className='w-full h--full px-10 py-3 ' />
        </div>
        <div className='flex flex-col gap-2 md:gap-4 md:py-3 mb-3 md:mb-0'>{FALLBACK_FOOTER_MENU.items.slice(0, Math.ceil(FALLBACK_FOOTER_MENU.items.length / 2)).map((item) => renderLink(item))}</div>
        <div className='flex flex-col gap-2 md:gap-4 md:py-3'>{FALLBACK_FOOTER_MENU.items.slice(Math.ceil(FALLBACK_FOOTER_MENU.items.length / 2)).map((item) => renderLink(item))}</div>
      </div>
    </nav>
  )
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'HOME',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'メニュー',
      type: 'メニュー',
      url: '/policies/refund-policy',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'お弁当',
      type: 'お弁当',
      url: '/policies/shipping-policy',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: '店舗案内',
      type: '店舗案内',
      url: '/policies/terms-of-service',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461633159225',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: '店主の想い',
      type: '店主の想い',
      url: '/policies/terms-of-service',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461633159226',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'ご予約',
      type: 'ご予約',
      url: '/policies/terms-of-service',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461633159227',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: '店主のこだわり',
      type: '店主のこだわり',
      url: '/policies/terms-of-service',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461633159228',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'ブログ',
      type: 'ブログ',
      url: '/policies/terms-of-service',
      items: []
    },
    {
      id: 'gid://shopify/MenuItem/461633159229',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'お問い合わせ',
      type: 'お問い合わせ',
      url: '/policies/terms-of-service',
      items: []
    }
  ]
}

function activeLinkStyle({ isActive, isPending }: { isActive: boolean; isPending: boolean }) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white'
  }
}
