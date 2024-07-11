import { gql } from '@apollo/client'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { getPaginationVariables } from '@shopify/hydrogen'
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { print } from 'graphql'
import type { AllProductsQuery, GetShopQuery } from 'src/gql/graphql'
import { Carousel } from '~/components/organisms/Carousel'
import { ChefIntroSection } from '~/components/organisms/ChefIntroSection'
import { GoogleMapSection } from '~/components/organisms/GoogleMapSection'
import { MenuSection } from '~/components/organisms/MenuSection'
import { TestimonialSection } from '~/components/organisms/TestimonialSection'
import { PRODUCTS_QUERY, SHOP_QUERY } from '~/graphql/storefront/queries'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.shop.name }, { name: 'description', content: data?.shop.description }]
}

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const { storefront, googleMapsApiKey } = context
  const { collections } = await storefront.query(FEATURED_COLLECTION_QUERY)
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4
  })
  const { shop } = await context.storefront.query<GetShopQuery>(print(SHOP_QUERY))

  const { products } = await context.storefront.query<AllProductsQuery>(print(PRODUCTS_QUERY), {
    variables: paginationVariables
  })
  const featuredCollection = collections.nodes[0]

  const SERVER_SIDE_RECOMMENDED_PRODUCTS_FRAGMENT = `#graphql
    fragment RecommendedProduct on Product {
    id
    title
    handle
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        id
        selectedOptions {
					name
					value
				}
      }
    }
  }
  `

  const SERVER_SIDE_RECOMMENDED_PRODUCTS_QUERY = `#graphql
    ${SERVER_SIDE_RECOMMENDED_PRODUCTS_FRAGMENT}
    query ServerSideRecommendedProducts($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
      products(first: 10, sortKey: UPDATED_AT, reverse: true) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
  `
  const recommendedProducts = await storefront.query<any>(SERVER_SIDE_RECOMMENDED_PRODUCTS_QUERY)
  return defer({ featuredCollection, recommendedProducts, googleMapsApiKey, products, shop })
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
  const { googleMapsApiKey, featuredCollection, recommendedProducts, products, shop } = data

  return (
    <div className='home flex flex-col flex-shrink-0 gap-8'>
      <Carousel images={carouselImages} />
      <MenuSection products={products.nodes as AllProductsQuery['products']['nodes']} />
      <ChefIntroSection />
      <TestimonialSection />
      <GoogleMapSection apiKey={googleMapsApiKey} />
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

const RECOMMENDED_PRODUCTS_FRAGMENT = gql`
  fragment RecommendedProduct on Product {
    id
    title
    handle
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        id
        selectedOptions {
          name
          value
        }
      }
    }
  }
`

const RECOMMENDED_PRODUCTS_QUERY = gql`
  ${RECOMMENDED_PRODUCTS_FRAGMENT}
  query RecommendedProducts($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`

// const RECOMMENDED_PRODUCTS_QUERY = `#graphql
//   fragment RecommendedProduct on Product {
//     id
//     title
//     handle
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     images(first: 1) {
//       nodes {
//         id
//         url
//         altText
//         width
//         height
//       }
//     }
//   }
//   query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     products(first: 4, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...RecommendedProduct
//       }
//     }
//   }
// ` as const
