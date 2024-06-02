const accessInfo = [
  { label: '店舗名', value: '膾炙' },
  { label: '住所', value: '福岡市中央区高砂1-5-2-2階' },
  { label: '電話番号', value: '092-526-2377' }
]

export const AccessInfo = () => (
  <table className='table-auto border-collapse text-left md:w-1/2 font-yumincho'>
    <tbody>
      {accessInfo.map((info) => (
        <tr className='md:border-b border-black p-2 md:p-4 gap-2 md:gap-4 flex' key={info.label}>
          <th className='flex items-center justify-start min-w-16'>
            <span>{info.label}</span>
          </th>
          <td className='flex-1'>{info.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
