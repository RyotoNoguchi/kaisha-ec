import { gql } from '@apollo/client'
// import { useLoaderData } from '@remix-run/react'
// import { getPaginationVariables } from '@shopify/hydrogen'
// import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
// import { print } from 'graphql'
// import type { AllProductsQuery } from 'src/gql/graphql'

// export const loader = async ({ context, request }: LoaderFunctionArgs) => {
//   const paginationVariables = getPaginationVariables(request, {
//     pageBy: 4
//   })
//   const { products } = await context.storefront.query<AllProductsQuery>(print(PRODUCTS_QUERY), {
//     variables: paginationVariables
//   })
//   return json({ products })
// }

export const Products = () => {
  // const { products } = useLoaderData<typeof loader>()
  // console.log('%capp/routes/products._index.tsx:20 products', 'color: #26bfa5;', products)
  return <div>products._index</div>
}

const PRODUCTS_QUERY = gql`
  query AllProducts {
    products {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          id
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
