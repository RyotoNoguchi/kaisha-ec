type Props = {
  phoneNumber: string
}

export const CartPickUpRemark: React.FC<Props> = ({ phoneNumber }) => {
  return (
    <>
      <p className='text-sm'>
        なお、 受取日はご注文日より2日後以降1週間以内の店舗が営業しております
        <span className='font-bold text-crimsonRed'>平日</span>と<span className='font-bold text-crimsonRed'>土曜日</span>をお選びいただけます。
      </p>
      <p className='text-sm '>
        ご希望の受取日が選択肢にない場合はお電話にてご相談ください。<span className='ml-1'>（TEL : {phoneNumber}）</span>
      </p>
    </>
  )
}
