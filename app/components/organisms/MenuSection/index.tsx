import React from 'react'
// import { ChefIntro } from '~/components/molecules/ChefIntro'
import { MenuList } from '~/components/molecules/MenuList'

const popularMenuItems = [
  {
    name: '春のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '夏のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '秋のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '冬のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '初夏のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '初冬のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  }
]
const chefRecommendMenuItems2 = [
  {
    name: '春のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '夏のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '秋のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '冬のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '初夏のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '初冬のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  }
]
const setMenuItems3 = [
  {
    name: '春のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '夏のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '秋のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '冬のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '初夏のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  },
  {
    name: '初冬のお野菜とお肉',
    price: '9800',
    image: '/image/product/bento.webp'
  }
]

export const MenuSection: React.FC = () => {
  // TODO: Replace with actual data calling storefront API
  return (
    <div className='w-full flex flex-col md:p-16 gap-8 md:gap-28'>
      <MenuList title='人気メニュー' menuItems={popularMenuItems} />
      <MenuList title='店主おすすめのメニュー' menuItems={chefRecommendMenuItems2} />
      <MenuList title='セットメニュー' menuItems={setMenuItems3} />
    </div>
  )
}