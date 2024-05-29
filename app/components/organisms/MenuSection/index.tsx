import React from 'react'
import { ChefIntro } from '~/components/molecules/ChefIntro'
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

const thoughtOfTheChef =
  '肉割烹 膾炙は、牛肉が食べたい時に想いだして頂きたいと思い、焼肉でもなく鉄板焼でもなく、和に寄り添い牛肉をコース仕立てで楽しんで頂きたいお店です。\
  美味しい食事を提供できるタイミング、空間も大切に考え２００９年にオープン致しました。\
  メインのお料理は牛肉のステーキで、素材の味を最大限に引き出す火入れにより、最高の美味しさの瞬間を召し上がって頂き楽しく素敵な時間を過ごして頂くことが、お店としての喜びです。\
  牛肉だけのコースと聞くと重たいイメージがあるかもしれませんが、そんな事はありません。前菜からデザートまで、1番のメインは牛肉のステーキです。そこを1番美味しく召し上がって頂くように、日々コースを組んでおります。\
  最後まで美味しくお楽しみ頂けると思います。'

const commitmentOfTheChef =
  '大切に育てられた佐賀牛をメインに当店がメインで仕入れているのは、佐賀県唐津「中村牧場」の黒毛和牛。全国トップクラスの高品質を誇る「佐賀牛」です。穏やかな気候、緑に囲まれた環境で約2200頭が育てられています。\
はじめてこちらの佐賀牛をいただいた時には、脂身の優しさ、噛むほどに広がる上品な旨味に驚きました。\
この感動を味わっていただけるよう、フレッシュな状態で真空したものを切り分け、大切に提供いたします。'

export const MenuSection: React.FC = () => {
  // TODO: Replace with actual data calling storefront API
  return (
    <div className='w-full flex flex-col md:p-16 gap-8 md:gap-28'>
      <MenuList title='人気メニュー' menuItems={popularMenuItems} />
      <MenuList title='店主おすすめのメニュー' menuItems={chefRecommendMenuItems2} />
      <MenuList title='セットメニュー' menuItems={setMenuItems3} />
      <ChefIntro title='店主の想い' text={thoughtOfTheChef} />
      <ChefIntro title='店主のこだわり' text={commitmentOfTheChef} />
    </div>
  )
}
