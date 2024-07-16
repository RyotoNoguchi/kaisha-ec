import { NavLink } from '@remix-run/react'
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
      <ul className='flex flex-col flex-1 md:flex-row md:justify-evenly gap-4 md:gap-2 lg:gap-4 w-full md:px-4'>
        {headerMenus?.items.map((item) => {
          if (!item.url) return null
          const url =
            item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain) || item.url.includes(primaryDomainUrl) ? new URL(item.url).pathname + (new URL(item.url).hash || '') : item.url
          return (
            <NavLink className='text-black md:text-white hover:opacity-70 transition-opacity duration-200' end key={item.id} onClick={closeAside} prefetch='intent' to={url}>
              {item.title}
            </NavLink>
          )
        })}
      </ul>
    </nav>
  )
}
