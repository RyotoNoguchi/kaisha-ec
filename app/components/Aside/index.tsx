import React from 'react'

type Props = {
  children?: React.ReactNode
  heading: React.ReactNode
  id?: string
  setIsMobileMenuOpen?: (isOpen: boolean) => void
}

/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export const Aside: React.FC<Props> = ({ children, heading, id = 'aside', setIsMobileMenuOpen }) => {
  return (
    <div aria-modal className='overlay' id={id} role='dialog'>
      <button
        className='close-outside'
        onClick={() => {
          history.go(-1)
          window.location.href = window.location.href.replace('mobile-menu-aside', '')
          setIsMobileMenuOpen && setIsMobileMenuOpen(false)
        }}
      />
      <aside>
        <header>
          <h3>{heading}</h3>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  )
}
