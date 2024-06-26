type Props = {
  width?: number
  height?: number
  strokeWidth?: number
  withBorder?: boolean
  color?: string
}

export const CloseIcon: React.FC<Props> = ({ width = 32, height = 32, strokeWidth = 1, withBorder = true, color = '#000000' }) => {
  return (
    <svg width={width} height={height} viewBox='0 0 52 52' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M31.3033 31.3033L20.6967 20.6967' stroke={color} strokeLinecap='round' strokeWidth={strokeWidth} />
      <path d='M20.6967 31.3033L31.3033 20.6967' stroke={color} strokeLinecap='round' strokeWidth={strokeWidth} />
      {withBorder && (
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M15.3934 36.6066C21.2513 42.4645 30.7487 42.4645 36.6066 36.6066C42.4645 30.7487 42.4645 21.2513 36.6066 15.3934C30.7487 9.53554 21.2513 9.53554 15.3934 15.3934C9.53553 21.2513 9.53553 30.7487 15.3934 36.6066Z'
          stroke={color}
        />
      )}
    </svg>
  )
}
