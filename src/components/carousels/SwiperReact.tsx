import { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { A11y, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { slides } from '../../data/slides'
import 'swiper/css'

export default function SwiperReact() {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <div>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        modules={[Navigation, Pagination, A11y]}
        loop={true}
        pagination={{
          el: '.swiper-react-pagination',
          clickable: true,
          bulletClass: 'swiper-dot',
          bulletActiveClass: 'swiper-dot-active',
        }}
        a11y={{
          enabled: true,
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          paginationBulletMessage: 'Go to slide {{index}}',
        }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="px-4">
              <img
                src={slide.img}
                alt={slide.alt}
                className="w-full h-52 object-cover rounded"
              />
              <h3 className="mt-4 mb-2 text-xl">{slide.title}</h3>
              <p className="m-0 mb-3 text-stone-600">{slide.text}</p>
              <a href="#" className="text-stone-700 underline">
                {slide.link}
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex justify-center gap-4 mt-4">
        <button
          type="button"
          className="carousel-btn"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          Previous
        </button>
        <button
          type="button"
          className="carousel-btn"
          onClick={() => swiperRef.current?.slideNext()}
        >
          Next
        </button>
      </div>
      <div className="swiper-react-pagination flex justify-center gap-2 mt-4" />
    </div>
  )
}
