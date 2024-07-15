import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { getPaginationVariables } from '@shopify/hydrogen'
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { print } from 'graphql'
import type { AllProductsQuery, GetAboutChefQuery, GetCarouselSlidesQuery, GetRecommendedCollectionQuery, GetShopQuery, GetTestimonialsQuery } from 'src/gql/graphql'
import { Carousel } from '~/components/organisms/Carousel'
import { ChefIntroSection } from '~/components/organisms/ChefIntroSection'
import { GoogleMapSection } from '~/components/organisms/GoogleMapSection'
import { MenuSection } from '~/components/organisms/MenuSection'
import { TestimonialSection } from '~/components/organisms/TestimonialSection'
import { ABOUT_CHEF_QUERY, CAROUSEL_SLIDES_QUERY, PRODUCTS_QUERY, RECOMMENDED_COLLECTION_QUERY, SHOP_QUERY, TESTIMONIALS_QUERY } from '~/graphql/storefront/queries'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.shop.name} | ホーム` }, { name: 'description', content: data?.shop.description }]
}

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const { storefront, googleMapsApiKey, shop: adminShop } = context
  const { collections } = await storefront.query(FEATURED_COLLECTION_QUERY)
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4
  })
  const aboutChef = context.storefront.query<GetAboutChefQuery>(print(ABOUT_CHEF_QUERY)).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    return null
  })
  const testimonials = context.storefront.query<GetTestimonialsQuery>(print(TESTIMONIALS_QUERY)).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    return null
  })

  const { metaobjects: carouselSlidesObj } = await context.storefront.query<GetCarouselSlidesQuery>(print(CAROUSEL_SLIDES_QUERY))
  const { shop } = await context.storefront.query<GetShopQuery>(print(SHOP_QUERY))

  const { collection: recommendedCollection } = await context.storefront.query<GetRecommendedCollectionQuery>(print(RECOMMENDED_COLLECTION_QUERY))

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
  return defer({ featuredCollection, recommendedProducts, googleMapsApiKey, products, shop, adminShop, testimonials, aboutChef, recommendedCollection, carouselSlidesObj })
}

const Homepage = () => {
  const data = useLoaderData<typeof loader>()
  const { googleMapsApiKey, featuredCollection, recommendedProducts, products, shop, adminShop, testimonials, aboutChef, recommendedCollection, carouselSlidesObj } = data
  const carouselSlides = carouselSlidesObj.nodes
    .map((carouselSlide) => {
      const heroImageField = carouselSlide.fields.find((field) => field.key === 'hero_image')
      if (heroImageField?.reference?.__typename === 'MediaImage') {
        return {
          id: carouselSlide.id,
          url: heroImageField.reference.image?.url ?? ''
        }
      }
      return null
    })
    .filter(Boolean)

  const shopInfo = {
    name: adminShop?.name ?? '',
    email: adminShop?.contactEmail ?? '',
    address: `${adminShop?.billingAddress.city}${adminShop?.billingAddress.address1}`,
    phoneNumber: adminShop?.billingAddress.phone ?? '',
    postalCode: adminShop?.billingAddress.zip ?? ''
  }

  return (
    <div className='home flex flex-col flex-shrink-0 gap-8'>
      <Carousel images={carouselSlides} />
      <MenuSection products={products.nodes as AllProductsQuery['products']['nodes']} collection={recommendedCollection as GetRecommendedCollectionQuery['collection']} />
      {aboutChef && <ChefIntroSection aboutChef={aboutChef as Promise<GetAboutChefQuery>} />}
      {testimonials && <TestimonialSection testimonials={testimonials as Promise<GetTestimonialsQuery>} />}
      <GoogleMapSection apiKey={googleMapsApiKey} shopInfo={shopInfo} />
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
