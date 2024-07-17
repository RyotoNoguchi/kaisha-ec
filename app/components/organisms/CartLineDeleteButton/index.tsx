import React from 'react'
import { CloseIcon } from '~/components/atoms/CloseIcon'

type Props = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const CartLineDeleteButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button className='grid place-content-center' onClick={onClick}>
      <CloseIcon />
    </button>
  )
}
