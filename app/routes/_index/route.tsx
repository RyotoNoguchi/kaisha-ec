import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { FeaturedCollection } from './FeaturedCollection'
import { RecommendedProducts } from './RecommendedProducts'

export const meta: MetaFunction = () => {
  return [{ title: 'Hydrogen | Home' }]
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context
  const { collections } = await storefront.query(FEATURED_COLLECTION_QUERY)
  const featuredCollection = collections.nodes[0]
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY)

  return defer({ featuredCollection, recommendedProducts })
}

const Homepage = () => {
  const data = useLoaderData<typeof loader>()
  return (
    <div className='home'>
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  )
}

export default Homepage

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const
