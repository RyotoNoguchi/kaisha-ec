import type { MetaFunction } from '@remix-run/react'
import { Link } from '@remix-run/react'
import { Image, useCart } from '@shopify/hydrogen-react'
import { Button } from '~/components/atoms/Button'
import { CloseIcon } from '~/components/atoms/CloseIcon'
import { ProductCounter } from '~/components/molecules/ProductCounter'

export const meta: MetaFunction = () => {
  return [{ title: `膾炙 | カート` }]
}

const Cart = () => {
  const { status, lines, cost, totalQuantity, id, cartAttributesUpdate, noteUpdate, linesUpdate, linesRemove } = useCart()
  const handleIncrement = ({ id, quantity }: { id: string; quantity: number }) => {
    if (!id || !quantity) return
    linesUpdate([{ id, quantity: quantity + 1 }])
  }
  const handleDecrement = ({ id, quantity }: { id: string; quantity: number }) => {
    if (!id || !quantity) return
    linesUpdate([{ id, quantity: quantity - 1 }])
  }
  const handleDelete = ({ id }: { id: string }) => {
    if (!id) return
    linesRemove([id])
  }

  if (!lines || lines.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center'>
        <p className='text-xl'>カートに商品がありません</p>
        <Link to='/'>
          <Button text='商品一覧へ' fontWeight='bold' />
        </Link>
      </div>
    )
  }

  return (
    <div className='flex flex-col font-yumincho py-10 px-4 md:px-14 lg:px-20 gap-9'>
      <div className='flex justify-between items-end'>
        <h1 className='flex text-4xl font-bold'>ご注文内容</h1>
        <span className='flex'>他の商品も見る</span>
      </div>
      <div className='flex flex-col gap-4 sm:gap-8'>
        {lines &&
          lines.length > 0 &&
          lines.map((line) => (
            <div className='grid grid-cols-[1fr,2fr] gap-2' key={line?.id}>
              <div className='flex gap-1 justify-center'>{line?.merchandise?.image && <Image data={line?.merchandise?.image} className='max-w-32 sm:max-w-44' />}</div>
              <div className='flex flex-col lg:flex-row gap-1 justify-between'>
                <div className='flex flex-col'>
                  <div className='flex justify-between'>
                    <p className='text-base sm:text-xl sm:text-bold leading-8'>{line?.merchandise?.product?.title}</p>
                    <button
                      className='grid place-content-center'
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault()
                        handleDelete({ id: line?.id ?? '' })
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex gap-1'>
                      {line?.merchandise?.selectedOptions &&
                        line?.merchandise?.selectedOptions?.map((option, index) => {
                          if (!option) return null
                          return (
                            <p key={option.name} className='text-xs flex gap-1'>
                              <span className=''>{option?.name}</span>
                              <span>:</span>
                              <span className=''>{option?.value}</span>
                              <span>{index === (line?.merchandise?.selectedOptions?.length ?? 0) - 1 ? '' : ','}</span>
                            </p>
                          )
                        })}
                    </div>
                    <p className='text-xs text-right'>{Number(line?.cost?.totalAmount?.amount)}円</p>
                  </div>
                </div>
                <div className='flex gap-2 lg:gap-8 items-center'>
                  <ProductCounter
                    count={line?.quantity ?? 0}
                    onIncrement={() => handleIncrement({ id: line?.id ?? '', quantity: line?.quantity ?? 0 })}
                    onDecrement={() => handleDecrement({ id: line?.id ?? '', quantity: line?.quantity ?? 0 })}
                    iconWidth={24}
                    iconHeight={25.5}
                    maxHeight={14}
                    gap={2}
                    textSize='xl'
                  />
                  <div className='grid place-content-center flex-1'>
                    <p className='text-black text-2xl font-bold'>{Number(line?.cost?.totalAmount?.amount)}円</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <hr className='border-gray border-opacity-50 border-2' />
    </div>
  )
}

export default Cart
