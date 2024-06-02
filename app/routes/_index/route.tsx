import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { ChefIntroSection } from '~/components/organisms/ChefIntroSection'
import { GoogleMapSection } from '~/components/organisms/GoogleMapSection'
import { MenuSection } from '~/components/organisms/MenuSection'
import { TestimonialSection } from '~/components/organisms/TestimonialSection'
import { Carousel } from './Carousel'

export const meta: MetaFunction = () => {
  return [{ title: 'Hydrogen | Home' }]
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context
  const { collections } = await storefront.query(FEATURED_COLLECTION_QUERY)
  const featuredCollection = collections.nodes[0]
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY)
  const env = context.env

  return defer({ featuredCollection, recommendedProducts, env })
}

const carouselImages = [
  { src: '/image/carousel/carousel-1.webp', alt: 'Image 1' },
  { src: '/image/carousel/carousel-2.webp', alt: 'Image 2' },
  { src: '/image/carousel/carousel-3.webp', alt: 'Image 3' },
  { src: '/image/carousel/carousel-4.webp', alt: 'Image 4' },
  { src: '/image/carousel/carousel-5.webp', alt: 'Image 5' },
  { src: '/image/carousel/carousel-6.webp', alt: 'Image 6' }
]

const Homepage = () => {
  const data = useLoaderData<typeof loader>()
  const { env } = data
  return (
    <div className='home flex flex-col flex-shrink-0 gap-8'>
      <Carousel images={carouselImages} />
      <MenuSection />
      <ChefIntroSection />
      <TestimonialSection />
      <GoogleMapSection apiKey={env.GOOGLE_MAPS_API_KEY} />
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
