import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import fontAwesome from '@fortawesome/fontawesome-free/css/all.min.css'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useLoaderData, useMatches, useRouteError, type ShouldRevalidateFunction } from '@remix-run/react'
import { useNonce } from '@shopify/hydrogen'
import { ShopifyProvider } from '@shopify/hydrogen-react'
import { defer, type LoaderFunctionArgs, type SerializeFrom } from '@shopify/remix-oxygen'
import React, { useEffect, useState } from 'react'
import swiperStyles from 'swiper/css'
import swiperNavigationStyles from 'swiper/css/navigation'
import swiperPaginationStyles from 'swiper/css/pagination'
import swiperScrollBarStyles from 'swiper/css/scrollbar'
import tailwind from 'tailwindcss/tailwind.css'
import { Layout } from '~/components/Layout'
import favicon from './assets/favicon.svg'
import appStyles from './styles/app.css'
import resetStyles from './styles/reset.css'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://itoshima-ochazuke.myshopify.com/api/graphql.json',
    headers: {
      'X-Shopify-Storefront-Access-Token': 'd61c36c751aef8b50b04ca8afc38c6fa'
    }
  }),
  cache: new InMemoryCache()
})

const CartProvider = React.lazy(() => import('@shopify/hydrogen-react').then((module) => ({ default: module.CartProvider })))

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({ formMethod, currentUrl, nextUrl }) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true
  }

  return false
}

export function links() {
  return [
    { rel: 'stylesheet', href: resetStyles },
    { rel: 'stylesheet', href: swiperStyles },
    { rel: 'stylesheet', href: swiperNavigationStyles },
    { rel: 'stylesheet', href: swiperPaginationStyles },
    { rel: 'stylesheet', href: swiperScrollBarStyles },
    { rel: 'stylesheet', href: fontAwesome },
    { rel: 'stylesheet', href: appStyles },
    { rel: 'stylesheet', href: tailwind },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com'
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app'
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon }
  ]
}

/**
 * Access the result of the root loader from a React component.
 */
export const useRootLoaderData = () => {
  const [root] = useMatches()
  return root?.data as SerializeFrom<typeof loader>
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, customerAccount, cart } = context
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN
  const publicStorefrontToken = context.env.PUBLIC_STOREFRONT_API_TOKEN

  const isLoggedInPromise = customerAccount.isLoggedIn()
  const cartPromise = cart.get()

  // defer the footer query (below the fold)
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer' // Adjust to your footer menu handle
    }
  })

  // await the header query (above the fold)
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu' // Adjust to your header menu handle
    }
  })

  return defer(
    {
      cart: cartPromise,
      footer: footerPromise,
      header: await headerPromise,
      isLoggedIn: isLoggedInPromise,
      publicStoreDomain,
      publicStorefrontToken
    },
    {
      headers: {
        'Set-Cookie': await context.session.commit()
      }
    }
  )
}

const App = () => {
  const nonce = useNonce()
  const data = useLoaderData<typeof loader>()
  const { publicStoreDomain, publicStorefrontToken } = data
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <ApolloProvider client={client}>
          <ShopifyProvider storeDomain={data.publicStoreDomain} storefrontToken={data.publicStorefrontToken} storefrontApiVersion='2024-04' countryIsoCode='JP' languageIsoCode='JA'>
            {isClient && (
              <React.Suspense fallback={<div>Loading cart...</div>}>
                <CartProvider>
                  <Layout {...data}>
                    <Outlet />
                  </Layout>
                </CartProvider>
              </React.Suspense>
            )}
          </ShopifyProvider>
        </ApolloProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}

export default App

export function ErrorBoundary() {
  const error = useRouteError()
  const rootData = useRootLoaderData()
  const nonce = useNonce()
  let errorMessage = 'Unknown error'
  let errorStatus = 500

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data
    errorStatus = error.status
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...rootData}>
          <div className='route-error'>
            <h1>Oops</h1>
            <h2>{errorStatus}</h2>
            {errorMessage && (
              <fieldset>
                <pre>{errorMessage}</pre>
              </fieldset>
            )}
          </div>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  )
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const
