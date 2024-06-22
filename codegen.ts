import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: {
    'https://itoshima-ochazuke.myshopify.com/api/graphql.json': {
      headers: {
        'X-Shopify-Storefront-Access-Token': 'd61c36c751aef8b50b04ca8afc38c6fa',
        'Content-Type': 'application/json'
      }
    }
  },
  documents: ['app/routes/_index.tsx', 'app/routes/products.$handle.tsx', 'app/routes/products._index.tsx', 'app/routes/cart.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      config: {
        scalars: {
          Date: 'Date', // Custom Scalarの型を指定
          DateTime: 'Date'
        },
        enumsAsTypes: true, // EnumをTypeとして生成
        avoidOptionals: true, // オプショナルなフィールドを避ける
        useTypeImports: true // 型のインポートを最適化
      }
    }
  },
  hooks: {
    afterAllFileWrite: ['prettier --write']
  }
}

export default config
