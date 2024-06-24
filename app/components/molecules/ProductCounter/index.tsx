import type { SelectedOption } from 'src/gql/graphql'
import { MinusIcon } from '~/components/atoms/MinusIcon'
import { PlusIcon } from '~/components/atoms/PlusIcon'

import { graphql } from 'src/gql/gql'

import { useQuery } from '@apollo/client'
import { useCart } from '@shopify/hydrogen-react'

type Props = {
  productId: string
  selectedOptions: SelectedOption[]
  count: number
  iconWidth: number
  iconHeight: number
  gap: number
  maxHeight: number
  textSize: 'xl' | '2xl' | '3xl'
  onIncrement: () => void
  onDecrement: () => void
}

export const ProductCounter: React.FC<Props> = ({ productId, selectedOptions, count, onIncrement, onDecrement, iconWidth, iconHeight, gap, maxHeight = 14, textSize }) => {
  const { lines } = useCart()
  const { data } = useQuery(document, { variables: { id: productId, selectedOptions } })
  const quantityAvailable = data?.product?.variantBySelectedOptions?.quantityAvailable ?? 0
  const variantId = data?.product?.variantBySelectedOptions?.id ?? ''
  const correspondingLineQuantity = lines?.find((line) => line?.merchandise?.id === variantId)?.quantity ?? 0
  const isPlusDisabled = count >= quantityAvailable - correspondingLineQuantity
  const isMinusDisabled = count <= 1
  return (
    <div className={`flex items-center border-gray border-opacity-50 border-2 rounded-md w-max p-2 gap-${gap} max-h-${maxHeight.toString()} `}>
      <button onClick={onDecrement} disabled={isMinusDisabled} className={`${isMinusDisabled ? 'cursor-not-allowed opacity-50' : ''}`}>
        <MinusIcon width={iconWidth} height={iconHeight} />
      </button>
      <p className={`text-${textSize}`}>{count}</p>
      <button onClick={onIncrement} disabled={isPlusDisabled} className={`${isPlusDisabled ? 'cursor-not-allowed opacity-50' : ''}`}>
        <PlusIcon width={iconWidth} height={iconHeight} />
      </button>
    </div>
  )
}

const document = graphql(/* Graphql */ `
  query Variant($id: ID!, $selectedOptions: [SelectedOptionInput!]!) {
    product(id: $id) {
      variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        title
        availableForSale
        quantityAvailable
        image {
          id
          url
          altText
          height
          width
        }
      }
    }
  }
`)
