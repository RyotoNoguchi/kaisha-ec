import { useRef, useState } from 'react'

type Props = {
  ingredients: string[]
}

export const Accordion: React.FC<Props> = ({ ingredients }) => {
  const [isOpen, setIsOpen] = useState(false)
  const answerRef = useRef<HTMLUListElement>(null)

  const handleToggle = (e: React.MouseEvent<HTMLUListElement> | React.KeyboardEvent<HTMLUListElement>) => {
    e.preventDefault()
    if (isOpen) {
      closeAccordion()
    } else {
      openAccordion()
    }
  }

  const closeAccordion = () => {
    const answer = answerRef.current
    if (!answer) return
    const closingAnim = answer.animate(closingAnimation(answer), animTiming)
    closingAnim.onfinish = () => {
      setIsOpen(false)
    }
  }

  const openAccordion = () => {
    setIsOpen(true)
    const answer = answerRef.current
    if (!answer) return
    answer.animate(openingAnimation(answer), animTiming)
  }

  const animTiming = {
    duration: 300,
    easing: 'ease-in',
    iterationCount: 1
  }

  const closingAnimation = (answer: HTMLUListElement) => [
    {
      height: answer.scrollHeight + 'px',
      opacity: 1
    },
    {
      height: 0,
      opacity: 0
    }
  ]

  const openingAnimation = (answer: HTMLUListElement) => [
    {
      height: 0,
      opacity: 0
    },
    {
      height: answer.scrollHeight + 'px',
      opacity: 1
    }
  ]

  return (
    <details className='flex flex-col gap-2' open={isOpen}>
      <summary
        className='font-semibold text-xl list-none'
        onClick={(e: React.MouseEvent<HTMLUListElement>) => handleToggle(e)}
        onKeyDown={(e: React.KeyboardEvent<HTMLUListElement>) => {
          if (e.key === 'Enter' || e.key === ' ') handleToggle(e)
        }}
        tabIndex={0}
        role='button'
      >
        原材料
      </summary>
      <ul className={`mt-2 flex gap-x-2 flex-wrap overflow-hidden`} ref={answerRef}>
        {ingredients.map((ingredient, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index} className='w-auto flex gap-2'>
            <p className='px-0 whitespace-nowrap'>{ingredient}</p>
            {index !== ingredients.length - 1 && <span className='text-gray'>/</span>}
          </li>
        ))}
      </ul>
    </details>
  )
}
