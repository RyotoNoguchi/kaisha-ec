import React from 'react'

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
export const Aside: React.FC<{ children?: React.ReactNode; heading: React.ReactNode; id?: string }> = ({ children, heading, id = 'aside' }) => {
  return (
    <div aria-modal className='overlay' id={id} role='dialog'>
      <button
        className='close-outside'
        onClick={() => {
          history.go(-1)
          window.location.hash = ''
        }}
      />
      <aside>
        <header>
          <h3>{heading}</h3>
          <CloseAside />
        </header>
        <main>{children}</main>
      </aside>
    </div>
  )
}

const CloseAside: React.FC = () => {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className='close' href='#' onClick={() => history.go(-1)}>
      &times;
    </a>
  )
}
