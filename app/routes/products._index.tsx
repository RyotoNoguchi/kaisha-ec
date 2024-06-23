import { useLoaderData } from '@remix-run/react'
import { getPaginationVariables } from '@shopify/hydrogen'
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { print } from 'graphql'
import type { AllProductsQuery } from 'src/gql/graphql'
import { PRODUCTS_QUERY } from '~/graphql/storefront/queries'

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
