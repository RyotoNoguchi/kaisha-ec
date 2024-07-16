import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { print } from 'graphql'
import type { GetAboutChefQuery, GetCarouselSlidesQuery, GetRecommendedCollectionQuery, GetShopQuery, GetTestimonialsQuery } from 'src/gql/graphql'
import { Carousel } from '~/components/organisms/Carousel'
import { ChefIntroSection } from '~/components/organisms/ChefIntroSection'
import { GoogleMapSection } from '~/components/organisms/GoogleMapSection'
import { MenuSection } from '~/components/organisms/MenuSection'
import { TestimonialSection } from '~/components/organisms/TestimonialSection'
import { ABOUT_CHEF_QUERY, CAROUSEL_SLIDES_QUERY, RECOMMENDED_COLLECTION_QUERY, SHOP_QUERY, TESTIMONIALS_QUERY } from '~/graphql/storefront/queries'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.shop.name} | ホーム` }, { name: 'description', content: data?.shop.description }]
}

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const { storefront, googleMapsApiKey, shop: adminShop } = context
  const aboutChef = storefront.query<GetAboutChefQuery>(print(ABOUT_CHEF_QUERY)).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    return null
  })
  const testimonials = storefront.query<GetTestimonialsQuery>(print(TESTIMONIALS_QUERY)).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    return null
  })
  const { metaobjects: carouselSlidesObj } = await storefront.query<GetCarouselSlidesQuery>(print(CAROUSEL_SLIDES_QUERY))
  const { shop } = await storefront.query<GetShopQuery>(print(SHOP_QUERY))
  const { collection: recommendedCollection } = await storefront.query<GetRecommendedCollectionQuery>(print(RECOMMENDED_COLLECTION_QUERY))
  return defer({ googleMapsApiKey, shop, adminShop, testimonials, aboutChef, recommendedCollection, carouselSlidesObj })
}

const Homepage = () => {
  const data = useLoaderData<typeof loader>()
  const { googleMapsApiKey, adminShop, testimonials, aboutChef, recommendedCollection, carouselSlidesObj } = data
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
      <MenuSection collection={recommendedCollection as GetRecommendedCollectionQuery['collection']} />
      {aboutChef && <ChefIntroSection aboutChef={aboutChef as Promise<GetAboutChefQuery>} />}
      {testimonials && <TestimonialSection testimonials={testimonials as Promise<GetTestimonialsQuery>} />}
      <GoogleMapSection apiKey={googleMapsApiKey} shopInfo={shopInfo} />
    </div>
  )
}

export default Homepage
