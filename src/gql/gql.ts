import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import * as types from './graphql'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  query AllProducts($country: CountryCode, $endCursor: String, $first: Int, $language: LanguageCode, $last: Int, $startCursor: String) @inContext(country: $country, language: $language) {\n    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {\n      nodes {\n        id\n        title\n        handle\n        featuredImage {\n          id\n          url\n          altText\n          height\n          width\n        }\n        metafields(identifiers: [{ namespace: "custom", key: "ingredients" }, { namespace: "custom", key: "shippable" }]) {\n          id\n          type\n          value\n          key\n        }\n        variants(first: 250) {\n          nodes {\n            id\n            title\n            availableForSale\n            image {\n              id\n              url\n              altText\n              height\n              width\n            }\n            selectedOptions {\n              name\n              value\n            }\n            product {\n              id\n              title\n              handle\n              priceRange {\n                minVariantPrice {\n                  amount\n                  currencyCode\n                }\n              }\n              featuredImage {\n                id\n                url\n                altText\n                height\n                width\n              }\n            }\n          }\n        }\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n          maxVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n':
    types.AllProductsDocument,
  '\n  query Variant($id: ID!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(id: $id) {\n      variantBySelectedOptions(selectedOptions: $selectedOptions) {\n        id\n        title\n        availableForSale\n        quantityAvailable\n        image {\n          id\n          url\n          altText\n          height\n          width\n        }\n      }\n    }\n  }\n':
    types.VariantDocument,
  '\n  query Menu($handle: String!) {\n    menu(handle: $handle) {\n      id\n      handle\n      itemsCount\n      title\n      items {\n        id\n        title\n        type\n        url\n      }\n    }\n  }\n':
    types.MenuDocument,
  '\n  query GetShop {\n    shop {\n      id\n      name\n      description\n      brand {\n        shortDescription\n        logo {\n          image {\n            url\n          }\n        }\n        squareLogo {\n          image {\n            url\n          }\n        }\n      }\n    }\n  }\n':
    types.GetShopDocument,
  '\n  query GetHeaderMenus {\n    menu(handle: "main-menu") {\n      items {\n        id\n        title\n        url\n      }\n    }\n  }\n': types.GetHeaderMenusDocument,
  '\n  query GetTestimonials {\n    metaobjects(type: "testimonial", first: 250) {\n      nodes {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n    }\n  }\n':
    types.GetTestimonialsDocument,
  '\n  query GetAboutChef {\n    metaobject(handle: { type: "about_chef", handle: "about-chef" }) {\n      id\n      handle\n      type\n      fields {\n        key\n        value\n        reference {\n          __typename\n          ... on MediaImage {\n            alt\n            image {\n              id\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.GetAboutChefDocument,
  '\n  query GetFooterMenus {\n    menu(handle: "footer") {\n      items {\n        id\n        title\n        url\n      }\n    }\n  }\n': types.GetFooterMenusDocument,
  '\n  query GetSocialMedias {\n    menu(handle: "footer-sns") {\n      items {\n        id\n        title\n        url\n      }\n    }\n  }\n': types.GetSocialMediasDocument,
  '\n  query GetRecommendedCollection {\n    collection(handle: "recommendations") {\n      id\n      handle\n      title\n      description\n      products(first: 20) {\n        nodes {\n          handle\n          id\n          title\n          description\n          featuredImage {\n            url\n            id\n          }\n          variants(first: 250) {\n            nodes {\n              id\n              title\n              availableForSale\n              image {\n                id\n                url\n                altText\n                height\n                width\n              }\n              selectedOptions {\n                name\n                value\n              }\n              product {\n                id\n                title\n                handle\n                priceRange {\n                  minVariantPrice {\n                    amount\n                    currencyCode\n                  }\n                }\n                featuredImage {\n                  id\n                  url\n                  altText\n                  height\n                  width\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.GetRecommendedCollectionDocument,
  '\n  query GetCarouselSlides {\n    metaobjects(type: "carousel", first: 10) {\n      nodes {\n        id\n        handle\n        fields {\n          type\n          key\n          value\n          reference {\n            __typename\n            ... on MediaImage {\n              alt\n              image {\n                id\n                url\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.GetCarouselSlidesDocument,
  '\n  query GetRestaurantBanner {\n    metaobjects(type: "restaurant", first: 250) {\n      nodes {\n        id\n        handle\n        field(key: "image_url") {\n          key\n          reference {\n            __typename\n            ... on MediaImage {\n              image {\n                id\n                url\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.GetRestaurantBannerDocument,
  '\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    quantityAvailable\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n':
    types.ProductVariantFragmentDoc,
  '\n  # https://shopify.dev/docs/api/storefront/2024-01/objects/Product#fields\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    featuredImage {\n      url\n      id\n    }\n    metafields(identifiers: [{ namespace: "custom", key: "ingredients" }, { namespace: "custom", key: "shippable" }]) {\n      id\n      type\n      value\n      key\n    }\n    options {\n      id\n      name\n      values\n    }\n    images(first: 250) {\n      edges {\n        node {\n          url\n          altText\n          id\n        }\n      }\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  \n':
    types.ProductFragmentDoc,
  '\n  query Product($country: CountryCode, $handle: String!, $language: LanguageCode, $selectedOptions: [SelectedOptionInput!]!) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  \n':
    types.ProductDocument
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AllProducts($country: CountryCode, $endCursor: String, $first: Int, $language: LanguageCode, $last: Int, $startCursor: String) @inContext(country: $country, language: $language) {\n    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {\n      nodes {\n        id\n        title\n        handle\n        featuredImage {\n          id\n          url\n          altText\n          height\n          width\n        }\n        metafields(identifiers: [{ namespace: "custom", key: "ingredients" }, { namespace: "custom", key: "shippable" }]) {\n          id\n          type\n          value\n          key\n        }\n        variants(first: 250) {\n          nodes {\n            id\n            title\n            availableForSale\n            image {\n              id\n              url\n              altText\n              height\n              width\n            }\n            selectedOptions {\n              name\n              value\n            }\n            product {\n              id\n              title\n              handle\n              priceRange {\n                minVariantPrice {\n                  amount\n                  currencyCode\n                }\n              }\n              featuredImage {\n                id\n                url\n                altText\n                height\n                width\n              }\n            }\n          }\n        }\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n          maxVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n'
): (typeof documents)['\n  query AllProducts($country: CountryCode, $endCursor: String, $first: Int, $language: LanguageCode, $last: Int, $startCursor: String) @inContext(country: $country, language: $language) {\n    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {\n      nodes {\n        id\n        title\n        handle\n        featuredImage {\n          id\n          url\n          altText\n          height\n          width\n        }\n        metafields(identifiers: [{ namespace: "custom", key: "ingredients" }, { namespace: "custom", key: "shippable" }]) {\n          id\n          type\n          value\n          key\n        }\n        variants(first: 250) {\n          nodes {\n            id\n            title\n            availableForSale\n            image {\n              id\n              url\n              altText\n              height\n              width\n            }\n            selectedOptions {\n              name\n              value\n            }\n            product {\n              id\n              title\n              handle\n              priceRange {\n                minVariantPrice {\n                  amount\n                  currencyCode\n                }\n              }\n              featuredImage {\n                id\n                url\n                altText\n                height\n                width\n              }\n            }\n          }\n        }\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n          maxVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Variant($id: ID!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(id: $id) {\n      variantBySelectedOptions(selectedOptions: $selectedOptions) {\n        id\n        title\n        availableForSale\n        quantityAvailable\n        image {\n          id\n          url\n          altText\n          height\n          width\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query Variant($id: ID!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(id: $id) {\n      variantBySelectedOptions(selectedOptions: $selectedOptions) {\n        id\n        title\n        availableForSale\n        quantityAvailable\n        image {\n          id\n          url\n          altText\n          height\n          width\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Menu($handle: String!) {\n    menu(handle: $handle) {\n      id\n      handle\n      itemsCount\n      title\n      items {\n        id\n        title\n        type\n        url\n      }\n    }\n  }\n'
): (typeof documents)['\n  query Menu($handle: String!) {\n    menu(handle: $handle) {\n      id\n      handle\n      itemsCount\n      title\n      items {\n        id\n        title\n        type\n        url\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetShop {\n    shop {\n      id\n      name\n      description\n      brand {\n        shortDescription\n        logo {\n          image {\n            url\n          }\n        }\n        squareLogo {\n          image {\n            url\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetShop {\n    shop {\n      id\n      name\n      description\n      brand {\n        shortDescription\n        logo {\n          image {\n            url\n          }\n        }\n        squareLogo {\n          image {\n            url\n          }\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetHeaderMenus {\n    menu(handle: "main-menu") {\n      items {\n        id\n        title\n        url\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetHeaderMenus {\n    menu(handle: "main-menu") {\n      items {\n        id\n        title\n        url\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetTestimonials {\n    metaobjects(type: "testimonial", first: 250) {\n      nodes {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetTestimonials {\n    metaobjects(type: "testimonial", first: 250) {\n      nodes {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetAboutChef {\n    metaobject(handle: { type: "about_chef", handle: "about-chef" }) {\n      id\n      handle\n      type\n      fields {\n        key\n        value\n        reference {\n          __typename\n          ... on MediaImage {\n            alt\n            image {\n              id\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetAboutChef {\n    metaobject(handle: { type: "about_chef", handle: "about-chef" }) {\n      id\n      handle\n      type\n      fields {\n        key\n        value\n        reference {\n          __typename\n          ... on MediaImage {\n            alt\n            image {\n              id\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFooterMenus {\n    menu(handle: "footer") {\n      items {\n        id\n        title\n        url\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFooterMenus {\n    menu(handle: "footer") {\n      items {\n        id\n        title\n        url\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetSocialMedias {\n    menu(handle: "footer-sns") {\n      items {\n        id\n        title\n        url\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetSocialMedias {\n    menu(handle: "footer-sns") {\n      items {\n        id\n        title\n        url\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetRecommendedCollection {\n    collection(handle: "recommendations") {\n      id\n      handle\n      title\n      description\n      products(first: 20) {\n        nodes {\n          handle\n          id\n          title\n          description\n          featuredImage {\n            url\n            id\n          }\n          variants(first: 250) {\n            nodes {\n              id\n              title\n              availableForSale\n              image {\n                id\n                url\n                altText\n                height\n                width\n              }\n              selectedOptions {\n                name\n                value\n              }\n              product {\n                id\n                title\n                handle\n                priceRange {\n                  minVariantPrice {\n                    amount\n                    currencyCode\n                  }\n                }\n                featuredImage {\n                  id\n                  url\n                  altText\n                  height\n                  width\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetRecommendedCollection {\n    collection(handle: "recommendations") {\n      id\n      handle\n      title\n      description\n      products(first: 20) {\n        nodes {\n          handle\n          id\n          title\n          description\n          featuredImage {\n            url\n            id\n          }\n          variants(first: 250) {\n            nodes {\n              id\n              title\n              availableForSale\n              image {\n                id\n                url\n                altText\n                height\n                width\n              }\n              selectedOptions {\n                name\n                value\n              }\n              product {\n                id\n                title\n                handle\n                priceRange {\n                  minVariantPrice {\n                    amount\n                    currencyCode\n                  }\n                }\n                featuredImage {\n                  id\n                  url\n                  altText\n                  height\n                  width\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetCarouselSlides {\n    metaobjects(type: "carousel", first: 10) {\n      nodes {\n        id\n        handle\n        fields {\n          type\n          key\n          value\n          reference {\n            __typename\n            ... on MediaImage {\n              alt\n              image {\n                id\n                url\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetCarouselSlides {\n    metaobjects(type: "carousel", first: 10) {\n      nodes {\n        id\n        handle\n        fields {\n          type\n          key\n          value\n          reference {\n            __typename\n            ... on MediaImage {\n              alt\n              image {\n                id\n                url\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetRestaurantBanner {\n    metaobjects(type: "restaurant", first: 250) {\n      nodes {\n        id\n        handle\n        field(key: "image_url") {\n          key\n          reference {\n            __typename\n            ... on MediaImage {\n              image {\n                id\n                url\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetRestaurantBanner {\n    metaobjects(type: "restaurant", first: 250) {\n      nodes {\n        id\n        handle\n        field(key: "image_url") {\n          key\n          reference {\n            __typename\n            ... on MediaImage {\n              image {\n                id\n                url\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    quantityAvailable\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n'
): (typeof documents)['\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    quantityAvailable\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  # https://shopify.dev/docs/api/storefront/2024-01/objects/Product#fields\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    featuredImage {\n      url\n      id\n    }\n    metafields(identifiers: [{ namespace: "custom", key: "ingredients" }, { namespace: "custom", key: "shippable" }]) {\n      id\n      type\n      value\n      key\n    }\n    options {\n      id\n      name\n      values\n    }\n    images(first: 250) {\n      edges {\n        node {\n          url\n          altText\n          id\n        }\n      }\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  \n'
): (typeof documents)['\n  # https://shopify.dev/docs/api/storefront/2024-01/objects/Product#fields\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    featuredImage {\n      url\n      id\n    }\n    metafields(identifiers: [{ namespace: "custom", key: "ingredients" }, { namespace: "custom", key: "shippable" }]) {\n      id\n      type\n      value\n      key\n    }\n    options {\n      id\n      name\n      values\n    }\n    images(first: 250) {\n      edges {\n        node {\n          url\n          altText\n          id\n        }\n      }\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  \n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Product($country: CountryCode, $handle: String!, $language: LanguageCode, $selectedOptions: [SelectedOptionInput!]!) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  \n'
): (typeof documents)['\n  query Product($country: CountryCode, $handle: String!, $language: LanguageCode, $selectedOptions: [SelectedOptionInput!]!) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  \n']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
