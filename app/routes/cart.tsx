import type { MetaFunction } from '@remix-run/react'
import { defer, Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { getPaginationVariables } from '@shopify/hydrogen'
import { Image, useCart } from '@shopify/hydrogen-react'
import { print } from 'graphql'
import { useEffect, useState } from 'react'
import type { SelectedOption } from 'src/generated/graphql'
import type { AllProductsQuery } from 'src/gql/graphql'
import { Button } from '~/components/atoms/Button'
import { ProductCounter } from '~/components/molecules/ProductCounter'
import { CartAmountTotal } from '~/components/organisms/CartAmountTotal'
import { CartHeading } from '~/components/organisms/CartHeading'
import { CartLineDeleteButton } from '~/components/organisms/CartLineDeleteButton'
import { CartLineTitle } from '~/components/organisms/CartLineTitle'
import { CartPickUpForm } from '~/components/organisms/CartPickUpForm'
import { CartTextArea } from '~/components/organisms/CartTextArea'
import { DeliveryOptionRadioButtons } from '~/components/organisms/DeliveryOptionRadioButtons'
import { PRODUCTS_QUERY } from '~/graphql/storefront/queries'
import { formatPhoneNumber } from '~/lib/phoneNumber'
import { translateText } from '~/lib/translate'

export const meta: MetaFunction = () => {
  return [{ title: `膾炙 | カート` }]
}

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const { deepLApiKey, storefront, shop } = context
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100 // maybe enough for now
  })
  const { products } = await storefront.query<AllProductsQuery>(print(PRODUCTS_QUERY), {
    variables: paginationVariables
  })
  return defer({ deepLApiKey, products, shop })
}

const CartPage = () => {
  const { deepLApiKey, products, shop } = useLoaderData<typeof loader>()
  const shippableProductIds = products.nodes.filter((product) => product.metafields.some((field) => field?.key === 'shippable' && field.value === 'true')).map((product) => product.id)
  const [translatedOptions, setTranslatedOptions] = useState<{ [key: string]: string }>({})
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'shipping'>('pickup')
  const { status, lines, cost, totalQuantity, id, cartAttributesUpdate, noteUpdate, linesUpdate, linesRemove, attributes, checkoutUrl } = useCart()
  const hasNonShippableProduct =
    (
      lines
        ?.filter((line) => {
          const productId = line?.merchandise?.product?.id
          return productId && !shippableProductIds.includes(productId)
        })
        ?.map((line) => line?.merchandise?.product?.id)
        ?.filter(Boolean) ?? []
    ).length > 0

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
  const [customerNote, setCustomerNote] = useState('')
  const isPickupDateAndTimeSelected = !!selectedDate && !!selectedTime

  const handleOrderConfirm = () => {
    if (checkoutButtonDisabled()) {
      alert(`受取${!selectedDate ? '日' : ''}${!selectedDate && !selectedTime ? 'と受取' : ''}${!selectedTime ? '時間' : ''}を選択してください`)
      return
    }

    if (deliveryOption === 'shipping') {
      try {
        if (checkoutUrl) {
          window.location.href = checkoutUrl // 更新後にチェックアウトページへリダイレクト
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('カートの更新に失敗しました:', error)
      }
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

  const handleClickStorePickUpRadioButton = () => {
    setSelectedDate('')
    setSelectedTime('')
  }

  const handleIncrement = ({ id, quantity }: { id: string; quantity: number }) => {
    if (!id || !quantity) return
    linesUpdate([{ id, quantity: quantity + 1 }])
  }
  const handleDecrement = ({ id, quantity }: { id: string; quantity: number }) => {
    if (!id || !quantity) return
    linesUpdate([{ id, quantity: quantity - 1 }])
  }
  const handleDelete = ({ id }: { id: string }, e: React.MouseEvent<HTMLButtonElement>) => {
    handleClickStorePickUpRadioButton()
    e.preventDefault()
    if (!id) return
    linesRemove([id])
  }

  const checkoutButtonDisabled = () => {
    // 配送不可能な商品がカートに含まれていない場合
    if (!hasNonShippableProduct) {
      // 配送希望の場合
      if (deliveryOption === 'shipping') {
        // 受取日と受取時間が選択されていない場合
        return false
      }
      if (deliveryOption === 'pickup') {
        if (isPickupDateAndTimeSelected) {
          return false
        }
      }
    } else {
      // 配送不可能な商品がカートに含まれている場合
      if (isPickupDateAndTimeSelected) {
        return false
      }
    }
    return true
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
      <CartHeading />
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
                    <CartLineTitle title={line?.merchandise?.product?.title ?? ''} />
                    <CartLineDeleteButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDelete({ id: line?.id ?? '' }, e)} />
                  </div>
                  {/* Variants */}
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
                              <span>{translatedOptions[option.name] ?? option.name}</span>
                              <span>:</span>
                              <span>{option?.value}</span>
                              <span>{index === (line?.merchandise?.selectedOptions?.length ?? 0) - 1 ? '' : ','}</span>
                            </p>
                          )
                        })}
                    </div>
                    <p className='text-xs text-right'>{Number(line?.cost?.totalAmount?.amount).toLocaleString()}円</p>
                  </div>
                </div>
                {/* Product Counter */}
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
        <div className='flex flex-col  gap-4 w-full'>
          <CartAmountTotal subtotalAmount={Number(cost?.subtotalAmount?.amount).toLocaleString()} totalAmount={Number(cost?.totalAmount?.amount).toLocaleString()} />
          {hasNonShippableProduct && (
            <CartPickUpForm isPickupDateAndTimeSelected={!!isPickupDateAndTimeSelected} setSelectedDate={setSelectedDate} setSelectedTime={setSelectedTime}>
              <p className='text-sm md:text-right'>
                配送対応していない商品がカートにふくまれているため、こちらのご注文は
                <span className='text-crimsonRed font-bold'>店舗受け取り</span>のみ可能です。
                <br /> 必ず<span className='font-bold px-0.5'>受取日</span>と<span className='font-bold px-0.5'>受取時間</span>を選択してください。
              </p>
            </CartPickUpForm>
          )}
          {!hasNonShippableProduct && <DeliveryOptionRadioButtons deliveryOption={deliveryOption} setDeliveryOption={setDeliveryOption} clearPickupDateAndTime={handleClickStorePickUpRadioButton} />}
          {!hasNonShippableProduct && deliveryOption === 'pickup' && (
            <CartPickUpForm isPickupDateAndTimeSelected={!!isPickupDateAndTimeSelected} setSelectedDate={setSelectedDate} setSelectedTime={setSelectedTime}>
              <div className='flex flex-col md:items-end'>
                <p className='text-sm'>
                  店舗受取をご希望の場合は必ず、<span className='font-bold px-0.5'>受取日</span>と<span className='font-bold px-0.5'>受取時間</span>を選択してください。
                </p>
                <p className='text-sm'>
                  なお、 受取日はご注文日より2日後以降1週間以内の店舗が営業しております
                  <span className='font-bold text-crimsonRed'>平日</span>と<span className='font-bold text-crimsonRed'>土曜日</span>をお選びいただけます。
                </p>
                <p className='text-sm '>
                  ご希望の受取日が選択肢にない場合はお電話にてご相談ください。<span className='ml-1'>（TEL : {formatPhoneNumber(shop?.billingAddress.phone ?? '')}）</span>
                </p>
              </div>
            </CartPickUpForm>
          )}
          {!hasNonShippableProduct && deliveryOption === 'shipping' && (
            <div className='flex flex-col md:items-end'>
              <p className=''>
                必ず、次の注文ページにて<span className='text-crimsonRed px-0.5 font-bold'>配達</span>項目の<span className='text-crimsonRed px-0.5 font-bold'>発送</span>
                を選択してください。
              </p>
            </div>
          )}
        </div>
        <div className='flex flex-col gap-4 lg:w-1/2'>
          <CartTextArea customerNote={customerNote} setCustomerNote={setCustomerNote} />
          <div className={`flex justify-end ${checkoutButtonDisabled() ? 'opacity-50' : 'hover:opacity-70 transition-opacity duration-200'}`}>
            <Button
              text='ご注文ページへ進む'
              fontWeight={'bold'}
              backgroundColor={checkoutButtonDisabled() ? 'bg-slate-500' : 'bg-crimsonRed'}
              onClick={handleOrderConfirm}
              disabled={checkoutButtonDisabled()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
