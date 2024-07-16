import type { MetaFunction } from '@remix-run/react'
import { defer, Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { Image, useCart } from '@shopify/hydrogen-react'
import { useEffect, useState } from 'react'
import type { SelectedOption } from 'src/generated/graphql'
import { Button } from '~/components/atoms/Button'
import { CloseIcon } from '~/components/atoms/CloseIcon'
import DateSelector from '~/components/atoms/DateSelector'
import { TimeSelector } from '~/components/atoms/TimeSelector'
import { ProductCounter } from '~/components/molecules/ProductCounter'
import { translateText } from '~/lib/translate'

export const meta: MetaFunction = () => {
  return [{ title: `膾炙 | カート` }]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { deepLApiKey } = context
  return defer({ deepLApiKey })
}

const Cart = () => {
  const { deepLApiKey } = useLoaderData<typeof loader>()
  const [translatedOptions, setTranslatedOptions] = useState<{ [key: string]: string }>({})

  const { status, lines, cost, totalQuantity, id, cartAttributesUpdate, noteUpdate, linesUpdate, linesRemove, attributes, checkoutUrl } = useCart()
  useEffect(() => {
    const translateOptions = async () => {
      const translations: { [key: string]: string } = {}
      for (const line of lines ?? []) {
        for (const option of line?.merchandise?.selectedOptions ?? []) {
          if (option?.name && !translations[option.name]) {
            translations[option.name] = await translateText(option.name, 'JA', deepLApiKey)
          }
        }
      }
      setTranslatedOptions(translations)
    }

    if (lines && lines.length > 0) {
      translateOptions()
    }
  }, [deepLApiKey, lines])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerNote, setCustomerNote] = useState('') // ユーザーのノート用の状態
  const handleOrderConfirm = () => {
    // 受取日時と受取時間の両方が未選択の場合に警告
    if (!selectedDate || !selectedTime) {
      alert(`受取${!selectedDate ? '日' : ''}${!selectedDate && !selectedTime ? 'と受取' : ''}${!selectedTime ? '時間' : ''}を選択してください`)
      return
    }

    const attributesToUpdate = [
      { key: 'deliveryDate', value: selectedDate },
      { key: 'deliveryTime', value: selectedTime }
    ]

    if (attributesToUpdate.every((attr) => attr.value)) {
      try {
        cartAttributesUpdate(attributesToUpdate) // 属性の更新を待つ
        if (checkoutUrl) {
          window.location.href = checkoutUrl // 更新後にチェックアウトページへリダイレクト
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('カートの更新に失敗しました:', error)
      }
    }
  }

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
      <div className='py-28 flex flex-col gap-10 items-center justify-center font-yumincho'>
        <p className='text-xl'>カートに商品がありません</p>
        <Link to='/'>
          <Button text='商品一覧へ' fontWeight='bold' className='font-yumincho hover:opacity-70 underline' />
        </Link>
      </div>
    )
  }

  return (
    <div className='flex flex-col font-yumincho py-10 px-4 md:px-14 lg:px-20 gap-9'>
      <div className='flex justify-between items-end'>
        <h1 className='flex text-4xl font-bold'>ご注文内容</h1>
        <div className='flex gap-2 font-semibold'>
          <Link to='/products' className='flex hover:opacity-70 transition-opacity duration-200'>
            他の商品も見る
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-4 sm:gap-8'>
        {lines &&
          lines.length > 0 &&
          lines.map((line) => (
            <div className='grid grid-cols-[1fr,2fr] gap-2' key={line?.id}>
              <div className='flex gap-1 justify-center items-center hover:opacity-70 transition-opacity duration-200'>
                <Link
                  to={{
                    pathname: `/products/${line?.merchandise?.product?.handle}`,
                    search: line?.merchandise?.selectedOptions?.map((option) => `${option?.name}=${option?.value}`).join('&')
                  }}
                >
                  {line?.merchandise?.image && <Image data={line?.merchandise?.image} className='max-w-32 sm:max-w-44' />}
                </Link>
              </div>
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
                          if (option.value === 'default') return null
                          if (!option.name) {
                            return null
                          }
                          return (
                            <p key={option.name} className='text-s flex gap-1'>
                              <span className=''>{translatedOptions[option.name] ?? option.name}</span>
                              <span>:</span>
                              <span className=''>{option?.value}</span>
                              <span>{index === (line?.merchandise?.selectedOptions?.length ?? 0) - 1 ? '' : ','}</span>
                            </p>
                          )
                        })}
                    </div>
                    <p className='text-xs text-right'>{Number(line?.cost?.totalAmount?.amount).toLocaleString()}円</p>
                  </div>
                </div>
                <div className='flex items-center gap-2 lg:gap-8'>
                  {line?.merchandise?.selectedOptions && line?.merchandise?.product?.id && (
                    <ProductCounter
                      productId={line?.merchandise?.product?.id ?? ''}
                      selectedOptions={(line?.merchandise?.selectedOptions as SelectedOption[]) ?? []}
                      count={line?.quantity ?? 0}
                      onIncrement={() => handleIncrement({ id: line?.id ?? '', quantity: line?.quantity ?? 0 })}
                      onDecrement={() => handleDecrement({ id: line?.id ?? '', quantity: line?.quantity ?? 0 })}
                      iconWidth={24}
                      iconHeight={25.5}
                      maxHeight={14}
                      gap={2}
                      textSize='xl'
                    />
                  )}
                  <div className='grid place-content-center flex-1'>
                    <p className='text-black text-2xl font-bold'>{Number(line?.cost?.totalAmount?.amount).toLocaleString()}円</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <hr className='border-gray border-opacity-50 border-2' />
      <div className='flex flex-col gap-2 items-end'>
        <div className='flex flex-col lg:flex-row-reverse gap-4 w-full'>
          <div className='flex flex-col gap-2 items-end'>
            <p className='flex gap-2 text-lg font-bold'>
              <span className=''>小計</span>
              <span className=''>{Number(cost?.subtotalAmount?.amount).toLocaleString()}円</span>
            </p>
            <p className='flex gap-2'>
              <span className='text-lg font-bold'>合計</span>
              <span className='text-xl font-extrabold text-crimsonRed'>{Number(cost?.totalAmount?.amount).toLocaleString()}円</span>
            </p>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='grid grid-cols-[2fr,1fr] lg:grid-cols-[1fr,1fr] gap-4 md:gap-6 lg:gap-8'>
              <div className='flex gap-2 items-start justify-end'>
                <span className='bg-crimsonRed text-white text-sm py-1 px-2'>必須</span>
                <p className='text-xl font-semibold'>受取日時</p>
              </div>
              <div className='flex flex-col md:flex-row lg:flex-col gap-1'>
                <DateSelector onChange={setSelectedDate} />
                <TimeSelector onChange={setSelectedTime} />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 lg:w-1/2'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='customerNote' className='text-xs'>
              ご注文に伴うご要望がございましたら、こちらにご記入ください
            </label>
            <textarea
              name='customerNote'
              id='customerNote'
              className='border border-gray-300 bg-slate-200 rounded-md text-black p-2 text-xs'
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder='特別な要望があればこちらに記入してください'
            />
          </div>
          <div className='flex justify-end hover:opacity-70 transition-opacity duration-200'>
            <Button text='ご注文ページへ進む' fontWeight={'bold'} backgroundColor='bg-crimsonRed' onClick={handleOrderConfirm} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
