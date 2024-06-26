import { Await } from '@remix-run/react'
import { Header } from 'app/components/Header/index'
import { Suspense, useState } from 'react'
import type { CartApiQueryFragment, FooterQuery, HeaderQuery } from 'storefrontapi.generated'
import { Footer } from '~/components/Footer'
import { MobileMenuAside } from '~/components/organisms/MobileMenuAside'

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>
  children?: React.ReactNode
  footer: Promise<FooterQuery>
  header: HeaderQuery
  isLoggedIn: Promise<boolean>
}

export const Layout = ({ cart, children = null, footer, header, isLoggedIn }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <>
      {/* <CartAside cart={cart} />
      <SearchAside /> */}
      <MobileMenuAside menu={header?.menu} shop={header?.shop} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      {header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />}
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>{(footer) => <Footer menu={footer?.menu} shop={header?.shop} />}</Await>
      </Suspense>
    </>
  )
}

// const SearchAside = () => {
//   return (
//     <Aside id='search-aside' heading='SEARCH'>
//       <div className='predictive-search'>
//         <br />
//         <PredictiveSearchForm>
//           {({ fetchResults, inputRef }) => (
//             <div>
//               <input name='q' onChange={fetchResults} onFocus={fetchResults} placeholder='Search' ref={inputRef} type='search' />
//               &nbsp;
//               <button
//                 onClick={() => {
//                   window.location.href = inputRef?.current?.value ? `/search?q=${inputRef.current.value}` : `/search`
//                 }}
//               >
//                 Search
//               </button>
//             </div>
//           )}
//         </PredictiveSearchForm>
//         <PredictiveSearchResults />
//       </div>
//     </Aside>
//   )
// }
