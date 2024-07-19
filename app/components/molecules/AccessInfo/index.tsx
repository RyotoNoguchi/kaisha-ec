import { formatPhoneNumber } from '~/lib/phoneNumber'

type Props = {
  name: string
  email: string
  address: string
  phoneNumber: string
  postalCode: string
}

export const AccessInfo: React.FC<Props> = ({ name, email, address, phoneNumber, postalCode }) => {
  const shopBasicInfo = [
    { label: '店舗名:', value: name },
    { label: '郵便番号:', value: postalCode },
    { label: '住所:', value: address },
    { label: '電話番号:', value: formatPhoneNumber(phoneNumber) },
    { label: 'メールアドレス:', value: email }
  ]
  return (
    <table className='table-auto border-collapse text-left md:w-1/2 font-yumincho'>
      <tbody>
        {shopBasicInfo.map((info) => (
          <tr className='md:border-b border-black p-2 md:p-4 gap-2 md:gap-4 flex' key={info.label}>
            <th className='flex items-center justify-start min-w-32'>
              <span>{info.label}</span>
            </th>
            <td className='flex-1'>{info.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
