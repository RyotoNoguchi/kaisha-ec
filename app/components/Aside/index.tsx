import React from 'react'
import { CloseIcon } from '~/components/atoms/CloseIcon'

type Props = {
  children?: React.ReactNode
  heading: React.ReactNode
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export const Aside: React.FC<Props> = ({ children, heading, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <div
      aria-modal
      className={`font-yumincho fixed left-0 right-0 top-0 bottom-0 transition-all duration-500 ${isMobileMenuOpen ? 'transform -translate-x-1/2 z-50' : 'transform z-40 translate-x-full'}`}
      role='dialog'
    >
      <button
        className={`bg-slate-200 border-none text-transparent transition-all duration-500 ease-in-out h-full left-0 top-0 ${isMobileMenuOpen ? 'opacity-70 w-full block z-50' : 'opacity-0 z-10'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside className={`flex flex-col ${isMobileMenuOpen ? 'w-1/2' : 'w-full'}`}>
        <div className='flex justify-between pl-4 items-center h-16 border-b-2 border-black' style={{ width: '50vw' }}>
          <header className='font-extrabold text-base'>
            <h3>{heading}</h3>
          </header>
          <button className='' type='button' onClick={() => setIsMobileMenuOpen(false)}>
            <CloseIcon width={48} height={48} strokeWidth={4} withBorder={false} />
          </button>
        </div>
        <main className='ml-4 flex flex-col gap-4' style={{ width: '50vw' }}>
          {children}
        </main>
      </aside>
    </div>
  )
}
