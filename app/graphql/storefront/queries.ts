import { gql } from '@apollo/client'

export const PRODUCTS_QUERY = gql`
  query AllProducts($country: CountryCode, $endCursor: String, $first: Int, $language: LanguageCode, $last: Int, $startCursor: String) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        handle
        featuredImage {
          id
          url
          altText
          height
          width
        }
        variants(first: 250) {
          nodes {
            id
            title
            availableForSale
            image {
              id
              url
              altText
              height
              width
            }
            selectedOptions {
              name
              value
            }
            product {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                id
                url
                altText
                height
                width
              }
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
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
