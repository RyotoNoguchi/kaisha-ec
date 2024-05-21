type Props = {
  color: string
}

export const HamburgerMenuIcon: React.FC<Props> = ({ color }) => (
  <svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g id='Size=Large'>
      <g id='Group'>
        <path id='Path 2' d='M12 14H36' stroke={color} strokeWidth='4' strokeLinecap='round' />
        <path id='Path 2_2' d='M12 24H36' stroke={color} strokeWidth='4' strokeLinecap='round' />
        <path id='Path 2_3' d='M12 34H36' stroke={color} strokeWidth='4' strokeLinecap='round' />
      </g>
    </g>
  </svg>
)
