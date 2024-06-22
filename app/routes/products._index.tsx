import { gql } from '@apollo/client'
import { useLoaderData } from '@remix-run/react'
import { getPaginationVariables } from '@shopify/hydrogen'
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { print } from 'graphql'
import type { AllProductsQuery } from 'src/gql/graphql'

export async function loader({ context, request }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4
  })

  const { products } = await context.storefront.query<AllProductsQuery>(print(PRODUCTS_QUERY), {
    variables: paginationVariables
  })

  return json({ products })
}

export default function Collections() {
  const { products } = useLoaderData<typeof loader>()

  return (
    <div className='collections'>
      <h1>Products</h1>
    </div>
  )
}

const PRODUCTS_QUERY = gql`
  query AllProducts($country: CountryCode, $endCursor: String, $first: Int, $language: LanguageCode, $last: Int, $startCursor: String) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      edges {
        cursor
        node {
          id
          featuredImage {
            id
            url
          }
        }
      }
      nodes {
        id
        title
        images(first: 1) {
          nodes {
            id
            url
          }
        }
        featuredImage {
          id
          url
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`
