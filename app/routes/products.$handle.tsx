import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { gql, useQuery } from '@apollo/client'
import { List, ListItem, Typography } from '@material-tailwind/react'
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { getSelectedProductOptions, Image, Money } from '@shopify/hydrogen'
import { AddToCartButton, BuyNowButton, ProductProvider, useCart } from '@shopify/hydrogen-react'
import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types'
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { print } from 'graphql'
import { useState } from 'react'
import { graphql } from 'src/gql/gql'
import type { ProductFragment as MyProductFragment, ProductVariantFragment as MyProductVariantFragment, ProductsQuery } from 'src/gql/graphql'
import { CustomAccordion as Accordion } from '~/components/molecules/Accordion'
import { ProductCounter } from '~/components/molecules/ProductCounter'
import ProductGallery from '~/components/molecules/ProductGallery'
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

  const { selectedVariant } = product
  const [productCount, setProductCount] = useState(1)
  const imageData = {
    altText: product?.selectedVariant?.image?.altText ?? '',
    id: product?.selectedVariant?.image?.id ?? '',
    url: product?.selectedVariant?.image?.url ?? ''
  }
  const [selectedImage, setSelectedImage] = useState<{ altText: string; id: string; url: URL }>(imageData)
  const handleImageClick = (image: { altText: string; id: string; url: URL }) => setSelectedImage(image)
  const handleAddToCart = () => {
    toast.success('カートに追加されました。カートページをご確認ください。')
  }
  const { lines } = useCart()
  const { data } = useQuery(document, { variables: { id: product.id, selectedOptions } })
  const quantityAvailable = data?.product?.variantBySelectedOptions?.quantityAvailable ?? 0
  const variantId = data?.product?.variantBySelectedOptions?.id ?? ''
  const correspondingLineQuantity = lines?.find((line) => line?.merchandise?.id === variantId)?.quantity ?? 0
  const isPlusDisabled = productCount > quantityAvailable - correspondingLineQuantity

  return (
    <ProductProvider data={product}>
      <div className='flex flex-col gap-10'>
        <ToastContainer pauseOnHover />
        <div className='flex flex-col px-6 py-6 sm:px-10 lg:px-32 xl:px-56 font-yumincho gap-10 w-full'>
          <div className='flex flex-col sm:flex-row gap-4 sm:gap-8 lg:gap-10'>
            <ProductGallery product={product as MyProductFragment & { selectedVariant: MyProductVariantFragment }} selectedImage={selectedImage} handleImageClick={handleImageClick} />
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
              {product.selectedVariant.availableForSale ? (
                !isPlusDisabled && (
                  <div className='flex flex-col gap-2'>
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
                      gap={5}
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
              <div className='flex gap-2'>
                {product.selectedVariant.availableForSale && !isPlusDisabled && (
                  <>
                    <AddToCartButton
                      quantity={productCount}
                      variantId={product?.selectedVariant?.id}
                      className='bg-yellow text-bold font-bold py-2 px-5 md:text-lg rounded-full md:min-w-36 border-grayOpacity border-2 hover:opacity-50 transition-opacity duration-3000'
                      onClick={handleAddToCart}
                    >
                      カートに追加
                    </AddToCartButton>
                    <BuyNowButton
                      variantId={product?.selectedVariant?.id ?? ''}
                      className='bg-crimsonRed text-white py-2 px-5 md:text-lg rounded-full md:min-w-36 border-grayOpacity border-2 hover:opacity-50 transition-opacity duration-3000'
                    >
                      今すぐ買う
                    </BuyNowButton>
                  </>
                )}
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
          <div className='flex flex-col gap-4 lg:px-10'>
            <Typography variant='h4' color='black' className='font-semibold text-xl md:text-2xl'>
              ご一緒にいかがですか？
            </Typography>
            <List className='flex flex-row p-0 gap-6 list-none w-full  overflow-x-auto'>
              {/* TODO Adminでデータ作成したら、RecommendedProductsに置換 */}
              {product.images.edges.map((image: { node: { url?: URL; altText: string | null; id: string | null } }) => (
                <ListItem className='w-auto hover:opacity-70' key={image.node.id}>
                  <Image data={{ url: image.node.url?.toString() ?? '', altText: image.node.altText ?? '', id: image.node.id ?? '' }} className='min-w-32 md:min-w-48 max-w-48' />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
        {/* eslint-disable-next-line hydrogen/prefer-image-component */}
        <img src='/image/pages/product/banner.webp' alt='レストランバナー' className='w-full' />
        <div className=''>
          <div className='font-yumincho flex flex-col gap-4 px-6 md:px-10 lg:px-32 xl:px-56'>
            <Typography variant='h4' color='black' className='text-2xl font-semibold flex flex-col gap-4 md:px-9 lg:px-10'>
              メニュー一覧
            </Typography>
            <List className='w-full gap-6 list-none p-0 flex flex-row overflow-x-auto md:mx-9'>
              {products.nodes.map((product) => (
                <Link to={`/products/${product.handle}`} key={product.id}>
                  <ListItem className='mb-2'>
                    <Image data={product.images.edges[0].node} className='min-w-32 md:min-w-48 max-w-48' />
                  </ListItem>
                </Link>
              ))}
            </List>
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
    metafields(identifiers: [{ namespace: "custom", key: "ingredients" }, { namespace: "custom", key: "shippable" }]) {
      id
      type
      value
      key
    }
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
