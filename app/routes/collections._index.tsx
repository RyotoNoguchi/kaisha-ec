import { json, Link, useLoaderData } from '@remix-run/react'
import { getPaginationVariables, Pagination } from '@shopify/hydrogen'
import { Image } from '@shopify/hydrogen-react'
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen'
import type { CollectionFragment } from 'storefrontapi.generated'

export async function loader({ context, request }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 1
  })

  const { collections } = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables
  })

  return json({ collections })
}

const Collections = () => {
  const { collections } = useLoaderData<typeof loader>()
  return (
    <div className='collections'>
      <h1>Collections</h1>
      <Pagination connection={collections}>
        {({ nodes, isLoading, PreviousLink, NextLink }) => (
          <div>
            <PreviousLink>{isLoading ? 'Loading...' : <span>↑ Load previous</span>}</PreviousLink>
            <CollectionsGrid collections={nodes} />
            <NextLink>{isLoading ? 'Loading...' : <span>Load more ↓</span>}</NextLink>
          </div>
        )}
      </Pagination>
    </div>
  )
}

export default Collections

const CollectionsGrid = ({ collections }: { collections: CollectionFragment[] }) => {
  return (
    <div className='collections-grid'>
      {collections.map((collection, index) => (
        <CollectionItem key={collection.id} collection={collection} index={index} />
      ))}
    </div>
  )
}

const CollectionItem = ({ collection, index }: { collection: CollectionFragment; index: number }) => {
  return (
    <Link className='collection-item' key={collection.id} to={`/collections/${collection.handle}`} prefetch='intent'>
      {collection?.image && <Image alt={collection.image.altText || collection.title} aspectRatio='1/1' data={collection.image} loading={index < 3 ? 'eager' : undefined} />}
      <h5>{collection.title}</h5>
    </Link>
  )
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const
