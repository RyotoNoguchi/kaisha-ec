import { RemixServer } from '@remix-run/react'
import { createContentSecurityPolicy } from '@shopify/hydrogen'
import type { EntryContext } from '@shopify/remix-oxygen'
import isbot from 'isbot'
import { renderToReadableStream } from 'react-dom/server'

export default async function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, remixContext: EntryContext) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // 必要に応じて 'unsafe-inline' も追加
      'https://maps.googleapis.com', // Google MapsのAPIを許可,
      'https://cdn.shopify.com', // ShopifyのCDNを許可
      'http://localhost:3100'
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // インラインスタイルを許可
      'https://fonts.googleapis.com', // Google Fontsを許可
      'https://cdn.shopify.com' // ShopifyのCDNを許可
    ],
    fontSrc: [
      "'self'",
      'data:', // データURIスキームを許可
      'https://fonts.gstatic.com', // Google Fontsからのフォントを許可
      'https://cdn.shopify.com', // ShopifyのCDNからのフォントを許可
      'http://localhost:3100' // ローカル開発環境を許可
    ],
    connectSrc: [
      // connect-src ディレクティブを追加
      'self',
      'https://maps.googleapis.com', // Google Maps API からのデータ取得を許可
      'https://monorail-edge.shopifysvc.com',
      'http://localhost:*',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
      'https://itoshima-ochazuke.myshopify.com/api/graphql.json', // Shopify GraphQL API を許可
      'https://itoshima-ochazuke.myshopify.com/2024-04/api/graphql.json', // Shopify GraphQL API を許可
      'https://itoshima-ochazuke.myshopify.com/api/2024-04/graphql.json', // Shopify GraphQL API を許可
      'https://c5c5ed-e8.myshopify.com/api/graphql.json', // Shopify GraphQL API を許可
      'https://c5c5ed-e8.myshopify.com/2024-04/api/graphql.json', // Shopify GraphQL API を許可
      'https://c5c5ed-e8.myshopify.com/api/2024-04/graphql.json' // Shopify GraphQL API を許可
    ],
    imgSrc: [
      'self',
      'data:',
      'https://cdn.shopify.com', // ShopifyのCDNからのフォントを許可
      'https://maps.googleapis.com',
      'https://maps.gstatic.com', // Google Mapsの静的リソースを許可
      'http://localhost:3000',
      'http://localhost:3100',
      request.url // 動的にリクエストのホスト名を追加
    ]
  })

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error)
        responseStatusCode = 500
      }
    }
  )

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady
  }

  responseHeaders.set('Content-Type', 'text/html')
  responseHeaders.set('Content-Security-Policy', header)

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  })
}
