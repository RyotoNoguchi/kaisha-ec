import { Link, useLoaderData } from '@remix-run/react'
import { getPaginationVariables, Pagination } from '@shopify/hydrogen'
import { Image } from '@shopify/hydrogen-react'
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { print } from 'graphql'
import type { AllProductsQuery } from 'src/gql/graphql'
import { ChevronIcon } from '~/components/atoms/ChevronIcon'
import { PRODUCTS_QUERY } from '~/graphql/storefront/queries'

export async function loader({ context, request }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 6
  })

  const { products } = await context.storefront.query<AllProductsQuery>(print(PRODUCTS_QUERY), {
    variables: paginationVariables
  })

  return json({ products })
}

const Products = () => {
  const { products } = useLoaderData<typeof loader>()
  return (
    <div className='flex flex-col gap-4 font-yumincho py-4 px-4'>
      <h1 className='text-2xl font-bold'>商品一覧</h1>
      <Pagination connection={products}>
        {() => (
          <div className='flex flex-col gap-4'>
            <ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 md:px-20 lg:px-4 gap-4'>
              {products.nodes.map((product) => (
                <li className='flex flex-col p-2 gap-4 bg-black rounded' key={product.id}>
                  <Link to={`/products/${product.handle}`}>
                    {product.featuredImage && <Image data={product.featuredImage} />}
                    <div className='flex flex-col'>
                      <h2 className='text-primary'>{product.title}</h2>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className='flex justify-between gap-4 px-4'>
              <div className=''>
                {products.pageInfo.hasPreviousPage && (
                  <Link to={`/products?direction=previous&cursor=${products.pageInfo.startCursor}`} preventScrollReset>
                    <ChevronIcon direction='left' />
                  </Link>
                )}
              </div>
              <div>
                {products.pageInfo.hasNextPage && (
                  <Link to={`/products?direction=next&cursor=${products.pageInfo.endCursor}`} preventScrollReset>
                    <ChevronIcon direction='right' />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </Pagination>
    </div>
  )
}

export default Products
