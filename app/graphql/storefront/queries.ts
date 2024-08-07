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
        metafields(identifiers: [{ namespace: "custom", key: "ingredients" }, { namespace: "custom", key: "shippable" }]) {
          id
          type
          value
          key
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

export const VARIANT_QUERY = gql`
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
`

export const MENU_QUERY = gql`
  query Menu($handle: String!) {
    menu(handle: $handle) {
      id
      handle
      itemsCount
      title
      items {
        id
        title
        type
        url
      }
    }
  }
`

export const SHOP_QUERY = gql`
  query GetShop {
    shop {
      id
      name
      description
      brand {
        shortDescription
        logo {
          image {
            url
          }
        }
        squareLogo {
          image {
            url
          }
        }
      }
    }
  }
`

export const HEADER_MENUS_QUERY = gql`
  query GetHeaderMenus {
    menu(handle: "main-menu") {
      items {
        id
        title
        url
      }
    }
  }
`
export const TESTIMONIALS_QUERY = gql`
  query GetTestimonials {
    metaobjects(type: "testimonial", first: 250) {
      nodes {
        id
        handle
        fields {
          key
          value
        }
      }
    }
  }
`

export const ABOUT_CHEF_QUERY = gql`
  query GetAboutChef {
    metaobject(handle: { type: "about_chef", handle: "about-chef" }) {
      id
      handle
      type
      fields {
        key
        value
        reference {
          __typename
          ... on MediaImage {
            alt
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`

export const FOOTER_MENUS_QUERY = gql`
  query GetFooterMenus {
    menu(handle: "footer") {
      items {
        id
        title
        url
      }
    }
  }
`

export const SOCIAL_MEDIAS_QUERY = gql`
  query GetSocialMedias {
    menu(handle: "footer-sns") {
      items {
        id
        title
        url
      }
    }
  }
`

export const RECOMMENDED_COLLECTION_QUERY = gql`
  query GetRecommendedCollection {
    collection(handle: "recommendations") {
      id
      handle
      title
      description
      products(first: 20) {
        nodes {
          handle
          id
          title
          description
          featuredImage {
            url
            id
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
        }
      }
    }
  }
`

export const CAROUSEL_SLIDES_QUERY = gql`
  query GetCarouselSlides {
    metaobjects(type: "carousel", first: 10) {
      nodes {
        id
        handle
        fields {
          type
          key
          value
          reference {
            __typename
            ... on MediaImage {
              alt
              image {
                id
                url
                width
                height
              }
            }
          }
        }
      }
    }
  }
`

export const RESTAURANT_BANNER_QUERY = gql`
  query GetRestaurantBanner {
    metaobjects(type: "restaurant", first: 250) {
      nodes {
        id
        handle
        field(key: "image_url") {
          key
          reference {
            __typename
            ... on MediaImage {
              image {
                id
                url
                width
                height
              }
            }
          }
        }
      }
    }
  }
`
