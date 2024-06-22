import React from 'react'

type Props = {
  onChange: (time: string) => void
}

export const TimeSelector: React.FC<Props> = ({ onChange }) => {
  // 時間の選択肢を生成する関数
  const generateTimeOptions = (): string[] => {
    const startTime = 11 // 開始時間 (11時)
    const endTime = 14 // 終了時間 (14時)
    const interval = 30 // 間隔 (30分)

    const times: string[] = []
    for (let hour = startTime; hour <= endTime; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push(timeString)
      }
    }
    return times
  }

  // 時間の選択肢
  const timeOptions = generateTimeOptions()

  return (
    <select onChange={(e) => onChange(e.target.value)} className='w-full text-xs border border-gray-300 bg-slate-200 rounded-md text-black p-2'>
      <option value=''>受取時間を選択</option>
      {timeOptions.map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
    </select>
  )
}
