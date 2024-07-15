import { useLocation } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import { Button } from '~/components/atoms/Button'
import { translateText } from '~/lib/translate'

type Props = {
  name: string
  deepLApiKey: string
  values: string[]
  setSearchParams: (params: URLSearchParams) => void
}

export const VariantSelectButtons: React.FC<Props> = ({ name, values, deepLApiKey, setSearchParams }) => {
  const [translatedName, setTranslatedName] = useState<string>('')
  const location = useLocation()
  const [weight, setWeight] = useState<string | null>(new URLSearchParams(location.search).get('weight'))

  useEffect(() => {
    const fetchTranslation = async () => {
      const result = await translateText(name, 'JA', deepLApiKey)
      setTranslatedName(result)
    }
    fetchTranslation()
  }, [name, deepLApiKey])

  const handleClick = (value: string) => {
    const params = new URLSearchParams(location.search)
    params.set('weight', value)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    setWeight(value)
    setSearchParams(params)
  }

  return (
    <div className='flex flex-col gap-2'>
      <p className='px-1'>{translatedName}をお選び下さい</p>
      <ul className='flex gap-2'>
        {values.map((value, index) => {
          const isActive = value === weight
          return (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index} className='cursor-pointer'>
              <Button text={value} fontWeight='bold' backgroundColor='bg-slate-400' borderWidth='border' opacity={isActive ? 'opacity-100' : 'opacity-40'} onClick={() => handleClick(value)} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
