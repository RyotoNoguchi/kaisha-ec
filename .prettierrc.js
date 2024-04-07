module.exports = {
  ...require('@shopify/prettier-config'),
  trailingComma: 'none',
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 200,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  plugins: ['prettier-plugin-organize-imports']
}
