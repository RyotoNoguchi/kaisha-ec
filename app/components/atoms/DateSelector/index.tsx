import { useEffect, useState } from 'react'
import { fetchJapanNationalHolidays } from './utils/holidays'

type Props = {
  onChange: (date: string) => void
}

export const DateSelector: React.FC<Props> = ({ onChange }) => {
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({})
  // 現在の日付を取得
  const today = new Date()

  // 日本の祝日を取得
  // Call the following API: https://holidays-jp.github.io/api/v1/date.json
  useEffect(() => {
    const fetchHolidays = async () => {
      const holidays = await fetchJapanNationalHolidays()
      setHolidays(holidays)
    }
    fetchHolidays()
  }, [])

  // 日付を YYYY-MM-DD 形式に変換する関数
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // 翌々日から1週間の日付を生成
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() + i + 2) // 翌々日から開始するために +2
    return date
    // 日曜日と祝日を除外
  }).filter((date) => date.getDay() !== 0 && !holidays[formatDate(date)])

  return (
    <select onChange={(e) => onChange(e.target.value)} className='w-full text-xs border border-gray-300 bg-slate-200 rounded-md text-black p-2'>
      <option value='' className=''>
        受取日を選択
      </option>
      {dates.map((date, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <option key={index} value={formatDate(date)}>
          {formatDate(date)}
        </option>
      ))}
    </select>
  )
}

export default DateSelector
