import { useLoaderData, type MetaFunction } from '@remix-run/react'
import { getSelectedProductOptions } from '@shopify/hydrogen'
import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types'
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import type { ProductFragment } from 'storefrontapi.generated'
import { ProductImage } from '~/components/molecules/ProductImage'
import { ProductMain } from '~/components/organisms/ProductMain'
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

  if (!handle) {
    throw new Error('Expected product handle to be defined')
  }

  // await the query for the critical product data
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle, selectedOptions }
  })

  if (!product?.id) {
    throw new Response(null, { status: 404 })
  }

  const firstVariant = product.variants.nodes[0]
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
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: { handle }
  })
  return defer({ product, variants })
}

const redirectToFirstVariant = ({ product, request }: { product: ProductFragment; request: Request }) => {
  const url = new URL(request.url)
  const firstVariant = product.variants.nodes[0]

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
  const { product, variants } = useLoaderData<typeof loader>()
  const { selectedVariant } = product

  return (
    <div className='product'>
      <ProductImage image={selectedVariant?.image} />
      <ProductMain selectedVariant={selectedVariant} product={product} variants={variants} />
    </div>
  )
}

export default Product

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
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
` as const

const PRODUCT_FRAGMENT = `#graphql
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
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
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
` as const

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const
