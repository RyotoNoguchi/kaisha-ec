// 拡張機能「Apollo GraphQL」で使用する設定ファイル
module.exports = {
  client: {
    service: {
      name: 'Kaisha-PROD',
      url: 'https://c5c5ed-e8.myshopify.com/api/graphql.json'
    },
    includes: ['./app/**/*.ts', './app/**/*.tsx', './app/**/*.js', './app/**/*.jsx'], // ここに対象ファイルパターンを追加
    excludes: ['**/__tests__/**'] // テストファイルを除外
  }
}
