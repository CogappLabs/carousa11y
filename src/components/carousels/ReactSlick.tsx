import { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { slides } from '../../data/slides'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Cast to bypass incorrect @types/react-slick types
const SlickSlider = Slider as any

export default function ReactSlickCarousel() {
  const sliderRef = useRef<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Manage tabindex on focusable elements in non-active slides
  useEffect(() => {
    if (!containerRef.current) return
    const slideElements = containerRef.current.querySelectorAll('.slick-slide')
    slideElements.forEach((slide) => {
      const focusables = slide.querySelectorAll(
        'a, button, input, select, textarea',
      )
      const isActive = slide.classList.contains('slick-active')
      focusables.forEach((el) => {
        el.setAttribute('tabindex', isActive ? '0' : '-1')
      })
    })
  }, [currentSlide])

  return (
    <div
      ref={containerRef}
      aria-label="Featured content carousel"
      role="region"
    >
      <SlickSlider
        ref={sliderRef}
        dots={false}
        arrows={false}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        beforeChange={(_: number, next: number) => setCurrentSlide(next)}
      >
        {slides.map((slide, i) => (
          <div key={i} className="react-slide">
            <img src={slide.img} alt={slide.alt} />
            <h3>{slide.title}</h3>
            <p>{slide.text}</p>
            <a href="#">{slide.link}</a>
          </div>
        ))}
      </SlickSlider>
      <div className="flex justify-center gap-4 mt-4">
        <button
          type="button"
          className="carousel-btn"
          onClick={() => sliderRef.current?.slickPrev()}
        >
          Previous
        </button>
        <button
          type="button"
          className="carousel-btn"
          onClick={() => sliderRef.current?.slickNext()}
        >
          Next
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => sliderRef.current?.slickGoTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === currentSlide ? 'true' : undefined}
            className={`w-3 h-3 rounded-full border-none cursor-pointer p-0 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${i === currentSlide ? 'bg-stone-800' : 'bg-stone-300 hover:bg-stone-400'}`}
          />
        ))}
      </div>
    </div>
  )
}
