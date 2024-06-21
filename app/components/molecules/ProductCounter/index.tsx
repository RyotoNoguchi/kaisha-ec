import { MinusIcon } from '~/components/atoms/MinusIcon'
import { PlusIcon } from '~/components/atoms/PlusIcon'

type Props = {
  count: number
  iconWidth: number
  iconHeight: number
  gap: number
  maxHeight: number
  textSize: 'xl' | '2xl' | '3xl'
  onIncrement: () => void
  onDecrement: () => void
}

export const ProductCounter: React.FC<Props> = ({ count, onIncrement, onDecrement, iconWidth, iconHeight, gap, maxHeight = 14, textSize }) => {
  return (
    <div className={`flex items-center border-gray border-opacity-50 border-2 rounded-md w-max p-2 gap-${gap} max-h-${maxHeight.toString()} `}>
      <button onClick={onDecrement}>
        <MinusIcon width={iconWidth} height={iconHeight} />
      </button>
      <p className={`text-${textSize}`}>{count}</p>
      <button onClick={onIncrement}>
        <PlusIcon width={iconWidth} height={iconHeight} />
      </button>
    </div>
  )
}
