// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build'
import { cartGetIdDefault, cartSetIdDefault, createCartHandler, createCustomerAccountClient, createStorefrontClient, storefrontRedirect } from '@shopify/hydrogen'
import { createRequestHandler, getStorefrontHeaders, type AppLoadContext } from '@shopify/remix-oxygen'
import { CART_QUERY_FRAGMENT } from '~/lib/fragments'
import { AppSession } from '~/lib/session'

import { LATEST_API_VERSION, shopifyApi } from '@shopify/shopify-api'
import '@shopify/shopify-api/adapters/cf-worker'
import { restResources } from '@shopify/shopify-api/rest/admin/2024-07'

import { gql } from '@apollo/client'
import { print } from 'graphql'

const getShopByAdmin = async (env: Env) => {
  const shopify = shopifyApi({
    apiKey: env.KAISHA_ADMIN_API_KEY,
    apiSecretKey: env.KAISHA_ADMIN_API_SECRET_KEY,
    hostName: env.PUBLIC_STORE_DOMAIN,
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false,
    isCustomStoreApp: true,
    adminApiAccessToken: env.KAISHA_ADMIN_API_ACCESS_TOKEN,
    restResources,
    future: {
      lineItemBilling: true,
      customerAddressDefaultFix: true
    }
  })
  const query = gql`
    query {
      shop {
        name
        contactEmail
        billingAddress {
          address1
          city
          phone
          zip
        }
      }
    }
  `

  try {
    const session = shopify.session.customAppSession(env.PUBLIC_STORE_DOMAIN)

    const client = new shopify.clients.Graphql({
      session,
      apiVersion: LATEST_API_VERSION
    })

    const response = await client.request<{ shop: { name: string; contactEmail: string; billingAddress: { address1: string; city: string; phone: string; zip: string } } }>(print(query))
    return response.data?.shop
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching shop address:', error)
    throw new Error('Failed to fetch shop address')
  }
}
/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext): Promise<Response> {
    try {
      /**
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set')
      }

      const waitUntil = executionContext.waitUntil.bind(executionContext)
      const [cache, session] = await Promise.all([caches.open('hydrogen'), AppSession.init(request, [env.SESSION_SECRET])])

      /**
       * Create Hydrogen's Storefront client.
       */
      const { storefront } = createStorefrontClient({
        cache,
        waitUntil,
        i18n: getLocaleFromRequest(request),
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request)
      })

      /**
       * Create a Shop for Admin API
       */
      const shop = await getShopByAdmin(env)

      /**
       * Create a client for Customer Account API.
       */
      const customerAccount = createCustomerAccountClient({
        waitUntil,
        request,
        session,
        customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        customerAccountUrl: env.PUBLIC_CUSTOMER_ACCOUNT_API_URL
      })

      /**
       * Create a cart handler that will be used to
       * create and update the cart in the session.
       */
      const cart = createCartHandler({
        storefront,
        customerAccount,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        cartQueryFragment: CART_QUERY_FRAGMENT
      })

      /**
       * Set the Google Maps API key in the environment.
       */
      const googleMapsApiKey = getGoogleMapsApiKey(env)

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: (): AppLoadContext => ({
          session,
          storefront,
          customerAccount,
          shop,
          cart,
          env,
          googleMapsApiKey,
          waitUntil
        })
      })

      const response = await handleRequest(request)

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({ request, response, storefront })
      }

      return response
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return new Response('An unexpected error occurred', { status: 500 })
    }
  }
}

function getLocaleFromRequest(request: Request): I18nLocale {
  const defaultLocale: I18nLocale = { language: 'EN', country: 'US' }
  const supportedLocales = {
    ES: 'ES',
    FR: 'FR',
    DE: 'DE',
    JP: 'JA'
  } as Record<I18nLocale['country'], I18nLocale['language']>

  const url = new URL(request.url)
  const domain = url.hostname.split('.').pop()?.toUpperCase() as keyof typeof supportedLocales

  return domain && supportedLocales[domain] ? { language: supportedLocales[domain], country: domain } : defaultLocale
}

// 環境変数からGoogle Maps APIキーを取得する関数
function getGoogleMapsApiKey(env: Env): string {
  const apiKey = env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('Google Maps API key is not set in the environment variables')
  }
  return apiKey
}
