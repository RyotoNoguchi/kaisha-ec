export const translateText = async (text: string, targetLang = 'JA'): Promise<string> => {
  const apiKey = 'd705766c-04b6-6fce-1882-bcb33f5e893a:fx'
  const url = 'https://api-free.deepl.com/v2/translate'
  const response = await fetch(url, {
    method: 'POST',
    body: new URLSearchParams({
      auth_key: apiKey,
      text,
      target_lang: targetLang
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  const data = (await response.json()) as {
    translations: Array<{ detected_source_language: string; text: string }>
    message?: string
  }
  if (data.message) {
    throw new Error(data.message)
  }

  return data.translations[0].text
}
