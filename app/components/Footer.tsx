import React from 'react'
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated'
import { FooterMenu } from '~/components/molecules/FooterMenu'

type FooterProps = FooterQuery & {
  shop: HeaderQuery['shop']
}

export const Footer: React.FC<FooterProps> = ({ menu, shop }) => {
  return <footer className='mt-20'>{menu && shop?.primaryDomain?.url && <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />}</footer>
}
