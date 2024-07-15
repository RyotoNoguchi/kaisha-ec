/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset'

import type { CustomerAccount, HydrogenCart, Storefront } from '@shopify/hydrogen'
import type { CountryCode, LanguageCode } from '@shopify/hydrogen/storefront-api-types'
import type { AppSession } from '~/lib/session'

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: { env: { NODE_ENV: 'production' | 'development' } }

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: string
    PUBLIC_STOREFRONT_API_TOKEN: string
    PRIVATE_STOREFRONT_API_TOKEN: string
    PUBLIC_STORE_DOMAIN: string
    PUBLIC_STOREFRONT_ID: string
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: string
    GOOGLE_MAPS_API_KEY: string
    KAISHA_ADMIN_API_KEY: string
    KAISHA_ADMIN_API_SECRET_KEY: string
    KAISHA_ADMIN_API_ACCESS_TOKEN: string
    DEEPL_API_KEY: string
  }

  /**
   * The I18nLocale used for Storefront API query context.
   */
  type I18nLocale = { language: LanguageCode; country: CountryCode }
}

declare module '@shopify/remix-oxygen' {
  /**
   * Declare local additions to the Remix loader context.
   */
  export interface AppLoadContext {
    env: Env
    cart: HydrogenCart
    shop:
      | {
          name: string
          contactEmail: string
          billingAddress: {
            address1: string
            city: string
            phone: string
            zip: string
          }
        }
      | undefined
    storefront: Storefront<I18nLocale>
    customerAccount: CustomerAccount
    session: AppSession
    googleMapsApiKey: string
    deepLApiKey: string
    waitUntil: ExecutionContext['waitUntil']
  }
}
