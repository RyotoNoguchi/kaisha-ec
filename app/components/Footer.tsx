import React from 'react'
import type { GetFooterMenusQuery, GetSocialMediasQuery } from 'src/gql/graphql'
import type { HeaderQuery } from 'storefrontapi.generated'
import { FooterMenu } from '~/components/molecules/FooterMenu'

type Props = { shop: HeaderQuery['shop'] } & { socialMedias: GetSocialMediasQuery['menu'] } & { footerMenus: GetFooterMenusQuery['menu'] } & { logoUrl: string }

export const Footer: React.FC<Props> = ({ shop, socialMedias, footerMenus, logoUrl }) => (
  <footer className='mt-40'>
    {footerMenus && shop?.primaryDomain?.url && <FooterMenu menu={footerMenus} primaryDomainUrl={shop.primaryDomain.url} socialMedias={socialMedias} logoUrl={logoUrl} />}
  </footer>
)
