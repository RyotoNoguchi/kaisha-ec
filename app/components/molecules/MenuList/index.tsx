import { MenuCard } from '~/components/molecules/MenuCard'

type Props = {
  title: string
  menuItems: {
    name: string
    price: string
    image: string
  }[]
}

export const MenuList: React.FC<Props> = ({ title, menuItems }) => {
  return (
    <div className='w-full flex flex-col gap-9 p-9 bg-beige'>
      <h2 className='text-2xl font-yumincho font-bold whitespace-nowrap'>{title}</h2>
      <MenuCard menuItems={menuItems} />
      <div className='flex justify-center'>
        <button className='px-11 bg-primary h-16 rounded-full font-yumincho font-bold text-center text-2xl'>メニュー一覧</button>
      </div>
    </div>
  )
}
