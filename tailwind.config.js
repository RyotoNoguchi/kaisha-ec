import formsPlugin from '@tailwindcss/forms'
import typographyPlugin from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [formsPlugin, typographyPlugin],
  theme: {
    extend: {
      colors: {
        'custom-black': '#000000',
        primary: '#BD9D5C',
        secondary: '#B9A57C',
        beige: '#CDC0A5',
        tertiary: '#E2CCA0',
        gray: '#000000',
        grayOpacity: '#00000050',
        yellow: '#FFB800',
        crimsonRed: '#B63700'
      },
      fontFamily: {
        yumincho: ['YuMincho', 'sans-serif']
      }
    }
  }
}
