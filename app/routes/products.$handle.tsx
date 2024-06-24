import { gql } from '@apollo/client'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { Image, Money, getSelectedProductOptions } from '@shopify/hydrogen'
import { AddToCartButton, BuyNowButton, ProductProvider } from '@shopify/hydrogen-react'
import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types'
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { print } from 'graphql'
import { useState } from 'react'
import type { ProductFragment as MyProductFragment, ProductVariantFragment as MyProductVariantFragment, ProductsQuery } from 'src/gql/graphql'
import { ProductCounter } from '~/components/molecules/ProductCounter'
import { getVariantUrl } from '~/lib/variants'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.product.title ?? ''}` }]
}

export const loader = async ({ params, request, context }: LoaderFunctionArgs) => {
  const { handle } = params
  const { storefront } = context

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
  // await the query for the critical product data
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

  /*
    In order to show which variants are available in the UI, we need to query
    all of them. But there might be a *lot*, so instead separate the variants
    into it's own separate query that is deferred. So there's a brief moment
    where variant options might show as available when they're not, but after
    this deffered query resolves, the UI will update.
  */
  const variants = storefront.query(print(VARIANTS_QUERY), {
    variables: { handle }
  })

  const { products } = await storefront.query<ProductsQuery>(print(PRODUCTS_QUERY))

  return defer({ product, variants, context, selectedOptions, products })
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
  const { product, variants, selectedOptions, products } = useLoaderData<typeof loader>()
  const { selectedVariant } = product
  const [productCount, setProductCount] = useState(1)
  const imageData = {
    altText: product?.selectedVariant?.image?.altText ?? '',
    id: product?.selectedVariant?.image?.id ?? '',
    url: product?.selectedVariant?.image?.url ?? ''
  }
  const [selectedImage, setSelectedImage] = useState<{ altText: string; id: string; url: URL }>(imageData)
  const handleImageClick = (image: { altText: string; id: string; url: URL }) => {
    setSelectedImage(image)
  }

  return (
    <ProductProvider data={product}>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col px-6 py-6 sm:px-10 lg:px-32 xl:px-56 font-yumincho gap-10 w-full'>
          <div className='flex flex-col sm:flex-row gap-4 sm:gap-8 lg:gap-10'>
            <div className='flex flex-col relative gap-4 flex-1 sm:aspect-square justify-center items-center'>
              <Image
                data={{ ...product?.selectedVariant?.image, altText: selectedImage.altText, id: selectedImage.id, url: selectedImage.url.toString() }}
                className='w-full h-full object-cover sm:max-w-96 sm:max-h-96 flex-1'
              />
              <ul className='w-full gap-8 overflow-x-auto whitespace-nowrap px-4 lg:px-10 xl:px-24 hidden sm:flex'>
                {product?.images?.edges &&
                  product.images.edges.map((image: { node: { url?: any; altText: string | null; id: string | null } }) => (
                    <li key={image.node.id} className='cursor-pointer'>
                      {image.node.url && (
                        <Image
                          data={{ url: image.node.url as string, altText: image.node.altText ?? '', id: image.node.id ?? '' }}
                          className='w-full h-full max-w-20 max-h-20'
                          onClick={() => handleImageClick({ altText: image.node.altText ?? '', id: image.node.id ?? '', url: new URL(image.node.url) })}
                        />
                      )}
                    </li>
                  ))}
              </ul>
            </div>
            <div className='flex flex-col flex-1 font-yumincho gap-3'>
              <div className='flex flex-col gap-1 md:gap-2'>
                <p className='text-gray opacity-50 font-semibold'>お弁当</p>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-extrabold'>{product.title}</h2>
                <Money data={product.selectedVariant.price} className='text-right text-lg' />
              </div>
              {product.selectedVariant.availableForSale ? (
                <div className='flex flex-col gap-2'>
                  <p className='text-gray opacity-50 font-semibold'>数量</p>
                  <ProductCounter
                    productId={product.id}
                    selectedOptions={selectedOptions}
                    count={productCount}
                    onIncrement={() => setProductCount(productCount + 1)}
                    onDecrement={() => setProductCount(productCount - 1)}
                    iconWidth={32}
                    iconHeight={34}
                    maxHeight={14}
                    gap={5}
                    textSize='3xl'
                  />
                </div>
              ) : (
                <p className='text-gray'>申し訳ございませんが、こちらの商品は現在販売停止中です</p>
              )}
              <div className='flex gap-2'>
                {product.selectedVariant.availableForSale && (
                  <>
                    <AddToCartButton
                      quantity={productCount}
                      variantId={product?.selectedVariant?.id}
                      className='bg-yellow text-bold font-bold py-2 px-5 md:text-lg rounded-full md:min-w-36 border-grayOpacity border-2'
                    >
                      カートに追加
                    </AddToCartButton>
                    <BuyNowButton variantId={product?.selectedVariant?.id ?? ''} className='bg-crimsonRed text-white py-2 px-5 md:text-lg rounded-full md:min-w-36 border-grayOpacity border-2'>
                      今すぐ買う
                    </BuyNowButton>
                  </>
                )}
              </div>
              <div className='flex flex-col'>
                <h3 className='font-semibold text-xl'>商品説明</h3>
                <p className=''>{product.description}</p>
                {/* TODO 商品詳細情報が来たら実装 */}
                {/* <div className='flex flex-col'>
                <div className='flex flex-col'>
                  <h4 className='' onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}>
                    原材料
                  </h4>
                  {isIngredientsOpen && (
                    <p className=''>
                      テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。
                    </p>
                  )}
                </div>
                <div className='flex flex-col'>
                  <h3 className='' onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}>
                    こだわり
                  </h3>
                  {isSpecialtyOpen && (
                    <p className=''>
                      テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。
                    </p>
                  )}
                </div>
                <div className='flex flex-col'>
                  <h3 className='' onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}>
                    配送日程
                  </h3>
                  {isDeliveryOpen && (
                    <p className=''>
                      テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。テキスト。
                    </p>
                  )}
                </div>
              </div> */}
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4 lg:px-10'>
            <h3 className='text-2xl font-semibold'>ご一緒にいかがですか？</h3>
            <ul className='w-full gap-6 flex overflow-x-auto'>
              {/* TODO Adminでデータ作成したら、RecommendedProductsに置換 */}
              {product.images.edges.map((image: { node: { url?: URL; altText: string | null; id: string | null } }) => (
                <li key={image.node.id}>
                  <Image data={{ url: image.node.url?.toString() ?? '', altText: image.node.altText ?? '', id: image.node.id ?? '' }} className='min-w-32 md:min-w-48 max-w-48' />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* eslint-disable-next-line hydrogen/prefer-image-component */}
        <img src='/image/pages/product/banner.webp' alt='レストランバナー' className='w-full' />
        <div className=''>
          <div className='font-yumincho flex flex-col gap-4 px-6 md:px-10 lg:px-32 xl:px-56'>
            <h3 className='text-2xl font-semibold flex flex-col gap-4 md:px-9 lg:px-10'>メニュー一覧</h3>
            <ul className='w-full gap-6 flex overflow-x-auto md:mx-9'>
              {products.nodes.map((product) => (
                <li key={product.id} className='mb-2'>
                  <Image data={product.images.edges[0].node} className='min-w-32 md:min-w-48 max-w-48' />
                </li>
              ))}
            </ul>
          </div>
        </div>
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
    options {
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

const PRODUCT_VARIANTS_FRAGMENT = gql`
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`

const VARIANTS_QUERY = gql`
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants($country: CountryCode, $language: LanguageCode, $handle: String!) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`

const PRODUCTS_QUERY = gql`
  query Products {
    products(first: 250) {
      nodes {
        id
        title
        handle
        description
        images(first: 250) {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  }
`
