import { type Tailwind } from 'types/tailwind'

type Props = {
  direction?: 'up' | 'down' | 'left' | 'right'
  color?: Tailwind['color']
  bgColor?: Tailwind['backgroundColor']
}

export const ChevronIcon = ({ direction = 'up', bgColor = 'bg-slate-300' }: Props) => {
  const rotationClass = {
    up: '',
    right: 'rotate-90',
    down: 'rotate-180',
    left: '-rotate-90'
  }

  return (
    <svg className={`${rotationClass[direction]} rotate ${bgColor} rounded-full`} width='36' height='36' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g id='Size=Small'>
        <g id='arrow-down'>
          <path id='Path 3' d='M18 14L12 8L6 14' stroke='black' strokeOpacity='0.5' strokeWidth='2' strokeLinecap='round' />
        </g>
      </g>
    </svg>
  )
}
