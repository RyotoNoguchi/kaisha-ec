import { gql } from '@apollo/client'

export const PRODUCTS_QUERY = gql`
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
