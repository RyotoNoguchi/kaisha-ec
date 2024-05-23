import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {
  images: { src: string; alt: string }[]
}

export const Carousel: React.FC<Props> = ({ images }) => {
  return (
    <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]} spaceBetween={0} navigation slidesPerView={1} pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 1 }}>
      {images.map((image, index) => (
        <SwiperSlide key={image.src}>
          {/* eslint-disable-next-line hydrogen/prefer-image-component */}
          <img src={image.src} alt={`carousel-${index}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
