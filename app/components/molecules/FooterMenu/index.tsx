import { NavLink, useLocation } from '@remix-run/react'
import { Image } from '@shopify/hydrogen-react'
import type { GetFooterMenusQuery, GetSocialMediasQuery } from 'src/gql/graphql'
import { InstagramIcon } from '~/components/atoms/InstagramIcon'
import { useRootLoaderData } from '~/root'

type Props = {
  menu: GetFooterMenusQuery['menu']
  socialMedias: GetSocialMediasQuery['menu']
  primaryDomainUrl: string
  logoUrl: string
}

export const FooterMenu: React.FC<Props> = ({ menu, primaryDomainUrl, socialMedias, logoUrl }) => {
  const { publicStoreDomain } = useRootLoaderData()
  const location = useLocation()
  if (!menu) return null

  const renderLink = (item: { id: string; title: string; url: string }) => {
    if (!item.url) return null
    const url = item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain) || item.url.includes(primaryDomainUrl) ? new URL(item.url).pathname : item.url
    const isExternal = !url.startsWith('/')
    return isExternal ? (
      <li className='pl-6 w-full h-full flex items-start hover:opacity-70 transition-opacity duration-200' key={item.id}>
        <a className='text-white text-left' href={url} key={item.id} rel='noopener noreferrer' target='_blank'>
          {item.title !== 'Instagram' ? (
            item.title
          ) : (
            <div className='flex items-center gap-2'>
              <InstagramIcon />
              <p className='text-white'>Instagram</p>
            </div>
          )}
        </a>
      </li>
    ) : (
      <NavLink
        className='pl-6 w-full h-full flex justify-start text-white hover:opacity-70 transition-opacity duration-200'
        end
        key={item.id}
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
  }

  return (
    <nav className='h-full w-full bg-black p-2 md:p-4 font-yumincho pb-14 lg:pb-20' role='navigation'>
      <div className='grid md:grid-cols-3 md:gap-12 p-2 md:p-4 lg:p-1'>
        <div className='flex justify-center items-start mb-4 md:mb-0 '>
          <Image src={logoUrl} alt='logo' width={300} height={150} />
        </div>
        <div className='grid grid-cols-2 gap-4 md:hidden'>
          <ul className='flex flex-col gap-3 '>{menu.items.map((footerMenu) => renderLink(footerMenu))}</ul>
          <ul className='flex  justify-center items-start'>{socialMedias?.items.map((socialMedia) => renderLink(socialMedia))}</ul>
        </div>
        <ul className='hidden md:flex flex-col gap-3 pt-10 lg:pt-14 '>{menu.items.map((footerMenu) => renderLink(footerMenu))}</ul>
        <ul className='hidden md:flex justify-center items-start pt-10 lg:pt-14'>{socialMedias?.items.map((socialMedia) => renderLink(socialMedia))}</ul>
      </div>
    </nav>
  )
}

function activeLinkStyle({ isActive, isPending }: { isActive: boolean; isPending: boolean }) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white'
  }
}
