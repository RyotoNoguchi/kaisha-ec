type Props = {
  title: string
  text: string
  sex: string
  customerAge: number
}

export const TestimonialCard: React.FC<Props> = ({ title, text, sex, customerAge }) => (
  <div className='bg-tertiary p-6 w-full sm:w-1/2 lg:w-1/3 flex-shrink-0'>
    <div className=' flex flex-col gap-5 font-yumincho h-full font-semibold'>
      <h3 className='font-extrabold text-xl'>{title}</h3>
      <div className='flex flex-col gap-3 flex-1 justify-between'>
        <p className=''>{text}</p>
        <div className='flex gap-1 justify-end'>
          <p className=''>{sex === 'man' ? '男性' : '女性'}</p>
          <p className=''>{customerAge}代</p>
        </div>
      </div>
    </div>
  </div>
)
