type Holidays = {
  [key: string]: string
}

export const fetchJapanNationalHolidays = async () => {
  const response = await fetch('https://holidays-jp.github.io/api/v1/date.json')
  const data = await response.json()
  return data as Holidays
}
