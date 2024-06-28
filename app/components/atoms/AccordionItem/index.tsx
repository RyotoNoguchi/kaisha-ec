import type { AccordionItemProps } from '@szhsin/react-accordion'
import { AccordionItem } from '@szhsin/react-accordion'
import { ChevronIcon } from '~/components/atoms/ChevronIcon'

export const CustomAccordionItem: React.FC<AccordionItemProps> = ({ header, content, ...rest }) => (
  <AccordionItem
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        <div className='text-lg font-semibold'>{header?.toString()}</div>
        <div className={`ml-auto transition-transform duration-200 ease-out ${isEnter && 'rotate-180'}`}>
          <ChevronIcon bgColor='bg-transparent' />
        </div>
      </>
    )}
    className='border-b'
    buttonProps={{
      className: ({ isEnter }) => `flex items-center w-full py-4 sm:py-4 text-left hover:bg-secondary-500 hover:opacity-40 ${isEnter && 'bg-primary-200'}`
    }}
    contentProps={{
      className: 'transition-height duration-200 ease-out'
    }}
    panelProps={{ className: 'sm:px-4 pb-4 text-bold' }}
  >
    {content}
  </AccordionItem>
)
