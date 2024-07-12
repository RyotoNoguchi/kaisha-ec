import { NavLink, useLocation } from '@remix-run/react'
import type { GetHeaderMenusQuery } from 'src/gql/graphql'
import type { HeaderQuery } from 'storefrontapi.generated'
import { useRootLoaderData } from '~/root'

type Props = {
  headerMenus: GetHeaderMenusQuery['menu']
  viewport: 'desktop' | 'mobile'
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url']
}

export const HeaderMenu: React.FC<Props> = ({ primaryDomainUrl, viewport, headerMenus }) => {
  const { publicStoreDomain } = useRootLoaderData()
  const location = useLocation()
  // const className = `header-menu-${viewport}`

  const closeAside = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (viewport === 'mobile') {
      event.preventDefault()
      window.location.href = event.currentTarget.href
    }
  }

  if (!headerMenus) {
    return <div>Loading...</div>
  }

  return (
    <nav className='md:flex w-full' role='navigation'>
      <ul className='flex flex-col flex-1 md:flex-row md:justify-evenly lg:justify-center  gap-4 md:gap-2 lg:gap-4 w-full md:px-4'>
        {headerMenus?.items.map((item) => {
          if (!item.url) return null
          const url =
            item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain) || item.url.includes(primaryDomainUrl) ? new URL(item.url).pathname + (new URL(item.url).hash || '') : item.url
          return (
            <NavLink
              className='text-black md:text-white'
              end
              key={item.id}
              onClick={closeAside}
              prefetch='intent'
              style={activeLinkStyle({
                isActive: location.pathname === new URL(url, window.location.origin).pathname && location.hash === new URL(url, window.location.origin).hash,
                isPending: false
              })}
              to={url}
            >
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
