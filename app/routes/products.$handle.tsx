import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { gql, useQuery } from '@apollo/client'
import { Typography } from '@material-tailwind/react'
import { useLoaderData, useLocation, useSearchParams, type MetaFunction } from '@remix-run/react'
import { getPaginationVariables, getSelectedProductOptions, Money } from '@shopify/hydrogen'
import { AddToCartButton, ProductProvider, useCart } from '@shopify/hydrogen-react'
import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types'
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { print } from 'graphql'
import { useEffect, useState } from 'react'
import { graphql } from 'src/gql/gql'
import type { AllProductsQuery, GetRestaurantBannerQuery, GetShopQuery, ProductFragment as MyProductFragment, ProductVariantFragment as MyProductVariantFragment } from 'src/gql/graphql'
import { CustomAccordion as Accordion } from '~/components/molecules/Accordion'
import { ProductCounter } from '~/components/molecules/ProductCounter'
import ProductGallery from '~/components/molecules/ProductGallery'
import { PRODUCTS_QUERY, RESTAURANT_BANNER_QUERY, SHOP_QUERY } from '~/graphql/storefront/queries'
import { getVariantUrl } from '~/lib/variants'

import { VariantSelectButtons } from '~/components/molecules/VariantSelectButtons'

import { CrossSellProductList } from '~/components/organisms/CrossSellProductList'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.shop.name} | ${data?.product.title ?? ''}` }, { name: 'description', content: data?.shop.description }]
}

export const loader = async ({ params, request, context }: LoaderFunctionArgs) => {
  const { handle } = params
  const { storefront } = context
  const { deepLApiKey } = context
  const { shop } = await context.storefront.query<GetShopQuery>(print(SHOP_QUERY))
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 6
  })
  const { products } = await context.storefront.query<AllProductsQuery>(print(PRODUCTS_QUERY), {
    variables: paginationVariables
  })
  const { metaobjects: restaurantBannerObj } = await context.storefront.query<GetRestaurantBannerQuery>(print(RESTAURANT_BANNER_QUERY))
  const restaurantBannerImageUrls = restaurantBannerObj.nodes
    .map((restaurantBanner) => {
      const imageField = restaurantBanner.field
      if (imageField?.reference?.__typename === 'MediaImage') return imageField.reference.image?.url
      return null
    })
    .filter(Boolean)

  const filteredProductsByCurrentProductHandle = products.nodes
    .filter((product) => product.handle !== handle)
    .map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      imageUrl: product.featuredImage?.url ?? ''
    }))

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid')
  )

  /* ex) selectedOptions =  [{	"name": "Label", "value": "FathersDay" },	{	"name": "Color",	"value": "Red" }]  */

  if (!handle) {
    throw new Error('Expected product handle to be defined')
  }

  type MyProductQueryType = { product: MyProductFragment & { selectedVariant: MyProductVariantFragment } }
  const { product } = await storefront.query<MyProductQueryType>(print(PRODUCT_QUERY), {
    variables: { handle, selectedOptions }
  })

  if (!product?.id) {
    throw new Response(null, { status: 404 })
  }

  const firstVariant = product.variants.nodes[0] as MyProductVariantFragment
  const firstVariantIsDefault = Boolean(firstVariant.selectedOptions.find((option: SelectedOption) => option.name === 'Title' && option.value === 'Default Title'))

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({ product, request })
    }
  }

  return defer({ product, context, selectedOptions, filteredProductsByCurrentProductHandle, restaurantBannerImageUrls, shop, deepLApiKey })
}
const redirectToFirstVariant = ({ product, request }: { product: MyProductFragment; request: Request }) => {
  const url = new URL(request.url)
  const firstVariant = product.variants.nodes[0] as MyProductVariantFragment

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search)
    }),
    {
      status: 302
    }
  )
}

const Product: React.FC = () => {
  const { product, selectedOptions, filteredProductsByCurrentProductHandle, deepLApiKey, restaurantBannerImageUrls } = useLoaderData<typeof loader>()
  const { data, refetch } = useQuery(document, { variables: { id: product.id, selectedOptions } })
  const [selectedVariant, setSelectedVariant] = useState(data?.product)
  const [_, setSearchParams] = useSearchParams()
  const [productCount, setProductCount] = useState(1)
  useEffect(() => {
    setProductCount(1)
  }, [product])

  const getQueryParamsAsObjectArray = (search: string) => {
    const params = new URLSearchParams(search)
    const result: { name: string; value: string }[] = []
    for (const [key, value] of params.entries()) {
      result.push({ name: key, value })
    }
    return result
  }
  const { search } = useLocation()
  const queryParamsArray = getQueryParamsAsObjectArray(search)

  useEffect(() => {
    const fetchData = async () => {
      const reFetchedData = await refetch({ id: product.id, selectedOptions: queryParamsArray })
      setSelectedVariant(reFetchedData.data.product)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParamsArray])

  const ingredients = product.metafields
    .find((metafield) => metafield && metafield.key === 'ingredients')
    ?.value.replaceAll('[', '')
    .replaceAll(']', '')
    .replaceAll('"', '')
    .replaceAll(',', ' / ')

  const accordionItems = [
    {
      header: '原材料',
      content: ingredients ?? ''
    }
  ]

  const shippable = product.metafields.find((metafield) => metafield && metafield.key === 'shippable')?.value === 'true'

  const handleAddToCart = () => {
    if (shippable) {
      toast.success('カートに追加されました。カートページをご確認ください。')
    } else {
      const userConfirmed = window.confirm('この商品は配送することができません。続けますか？')
      if (userConfirmed) {
        toast.success('カートに追加されました。カートページをご確認ください。')
      } else {
        return
      }
    }
  }

  // const handleClickBuyNowButton = () => {
  //   if (!shippable) {
  //     const userConfirmed = window.confirm('この商品は配送することができません。続けますか？')
  //     if (!userConfirmed) {
  //       return
  //     }
  //   }
  // }
  const { lines } = useCart()
  const quantityAvailable = data?.product?.variantBySelectedOptions?.quantityAvailable ?? 0
  const variantId = data?.product?.variantBySelectedOptions?.id ?? ''
  const correspondingLineQuantity = lines?.find((line) => line?.merchandise?.id === variantId)?.quantity ?? 0
  const isPlusDisabled = productCount > quantityAvailable - correspondingLineQuantity

  return (
    <ProductProvider data={product}>
      <div className='flex flex-col gap-10'>
        <ToastContainer pauseOnHover />
        <div className='flex flex-col px-6 py-6 sm:px-10 lg:px-32 xl:px-56 font-yumincho gap-10 w-full'>
          <div className='w-full flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-10'>
            <div className='w-full sm:w-1/2'>
              <ProductGallery product={product as MyProductFragment & { selectedVariant: MyProductVariantFragment }} />
            </div>
            <div className='flex flex-col flex-1 font-yumincho gap-3'>
              <div className='flex flex-col gap-1 md:gap-2'>
                <Typography variant='h6' color='black' className='font-semibold'>
                  お弁当
                </Typography>
                <Typography variant='h1' color='black' className='font-extrabold text-2xl md:text-3xl lg:text-4xl'>
                  {product.title}
                </Typography>
                <Typography variant='small' className='text-red-700 font-semibold'>
                  {shippable ? 'こちらの商品は配送もお受けしております。' : 'こちらの商品は配送はお受けしておりません。店頭受取のみ可能です。'}
                </Typography>
                <Money data={product.selectedVariant.price} className='text-right text-lg' />
              </div>
              {product.options.map((option) => {
                const hasVariant = !option.values.some((value) => value === 'default')
                return hasVariant && <VariantSelectButtons key={option.id} name={option.name} values={option.values} deepLApiKey={deepLApiKey} setSearchParams={setSearchParams} />
              })}
              <div className='flex justify-between items-end'>
                {product.selectedVariant.availableForSale ? (
                  !isPlusDisabled && (
                    <div className='flex flex-col gap-2 items-start'>
                      <Typography variant='paragraph' color='black' className='font-semibold opacity-80'>
                        数量
                      </Typography>
                      <ProductCounter
                        productId={product.id}
                        selectedOptions={selectedOptions}
                        count={productCount}
                        onIncrement={() => setProductCount(productCount + 1)}
                        onDecrement={() => setProductCount(productCount - 1)}
                        iconWidth={32}
                        iconHeight={34}
                        maxHeight={14}
                        gap={3}
                        textSize='3xl'
                      />
                    </div>
                  )
                ) : (
                  <Typography variant='paragraph' color='black' className='font-semibold'>
                    申し訳ございませんが、こちらの商品は現在販売停止中です
                  </Typography>
                )}
                {product.selectedVariant.availableForSale && isPlusDisabled && (
                  <Typography variant='paragraph' color='black' className='font-semibold'>
                    申し訳ございませんが、この商品はこれ以上購入可能な在庫がございません
                  </Typography>
                )}
                <div className='flex gap-2 justify-end h-full items-end'>
                  {product.selectedVariant.availableForSale && !isPlusDisabled && (
                    <div className='flex items-end h-full'>
                      <AddToCartButton
                        quantity={productCount}
                        variantId={selectedVariant?.variantBySelectedOptions?.id}
                        className='bg-yellow truncate text-bold font-bold py-2 px-5 md:text-lg rounded-full md:min-w-36 border-grayOpacity border-2 hover:opacity-50 transition-opacity duration-3000'
                        onClick={handleAddToCart}
                      >
                        カート追加
                      </AddToCartButton>
                      {/* <BuyNowButton
                        variantId={product?.selectedVariant?.id ?? ''}
                        className='bg-crimsonRed text-white py-2 px-5 md:text-lg rounded-full md:min-w-36 border-grayOpacity border-2 hover:opacity-50 transition-opacity duration-3000'
                        onClick={handleClickBuyNowButton}
                        quantity={productCount}
                      >
                        今すぐ買う
                      </BuyNowButton> */}
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Typography variant='h4' color='black' className='font-semibold text-xl'>
                    商品説明
                  </Typography>
                  <Typography variant='paragraph' color='black' className='font-semibold text-sm'>
                    {product.description}
                  </Typography>
                </div>
                <Accordion accordionItems={accordionItems} />
              </div>
            </div>
          </div>
          <CrossSellProductList
            products={
              filteredProductsByCurrentProductHandle as {
                id: string
                title: string
                handle: string
                imageUrl: string
              }[]
            }
          />
        </div>
        {/* {restaurantBannerImageUrls && <Image src={restaurantBannerImageUrls[0]} alt='レストランバナー' className='w-full' />} */}
      </div>
    </ProductProvider>
  )
}

export default Product

const PRODUCT_VARIANT_FRAGMENT = gql`
  fragment ProductVariant on ProductVariant {
    availableForSale
    quantityAvailable
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`

const PRODUCT_FRAGMENT = gql`
  # https://shopify.dev/docs/api/storefront/2024-01/objects/Product#fields
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    featuredImage {
      url
      id
    }
    metafields(identifiers: [{ namespace: "custom", key: "ingredients" }, { namespace: "custom", key: "shippable" }]) {
      id
      type
      value
      key
    }
    options {
      id
      name
      values
    }
    images(first: 250) {
      edges {
        node {
          url
          altText
          id
        }
      }
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`

const PRODUCT_QUERY = gql`
  query Product($country: CountryCode, $handle: String!, $language: LanguageCode, $selectedOptions: [SelectedOptionInput!]!) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`

const document = graphql(/* Graphql */ `
  query Variant($id: ID!, $selectedOptions: [SelectedOptionInput!]!) {
    product(id: $id) {
      variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        title
        availableForSale
        quantityAvailable
        image {
          id
          url
          altText
          height
          width
        }
      }
    }
  }
`)
