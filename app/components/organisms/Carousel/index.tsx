import { Image } from '@shopify/hydrogen-react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {
  images: { url: string; id: string }[]
}

export const Carousel: React.FC<Props> = ({ images }) => {
  return (
    <Swiper
      className='w-full'
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={0}
      navigation
      slidesPerView={1}
      pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 1 }}
    >
      {images.map((image, index) => (
        <SwiperSlide key={image.id}>
          <Image src={image.url} alt={`carousel-${index}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
