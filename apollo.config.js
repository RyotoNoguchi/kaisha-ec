// 拡張機能「Apollo GraphQL」で使用する設定ファイル
module.exports = {
  client: {
    service: {
      name: 'itoshima-ochazuke',
      url: 'https://itoshima-ochazuke.myshopify.com/api/graphql.json'
    },
    includes: ['./app/**/*.ts', './app/**/*.tsx', './app/**/*.js', './app/**/*.jsx'], // ここに対象ファイルパターンを追加
    excludes: ['**/__tests__/**'] // テストファイルを除外
  }
}
