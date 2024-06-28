import { Accordion } from '@szhsin/react-accordion'
import { CustomAccordionItem } from '~/components/atoms/AccordionItem'

type Props = {
  accordionItems: {
    header: string
    content: string
  }[]
}

export const CustomAccordion: React.FC<Props> = ({ accordionItems }) => {
  const hasContent = accordionItems.every(({ content }) => !(content === ''))
  if (!hasContent) return null
  return (
    <div className='mx-2 my-4 border-t'>
      <Accordion transition transitionTimeout={200}>
        {accordionItems.map(({ header, content }, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <CustomAccordionItem key={i} header={header} content={content} />
        ))}
      </Accordion>
    </div>
  )
}
