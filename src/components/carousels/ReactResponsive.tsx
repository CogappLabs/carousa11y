import { useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import { slides } from '../../data/slides'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export default function ReactResponsiveCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const prev = () =>
    setCurrentSlide((s) => (s === 0 ? slides.length - 1 : s - 1))
  const next = () =>
    setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1))
  const goTo = (index: number) => setCurrentSlide(index)

  return (
    <div aria-label="Featured content carousel" role="region">
      <Carousel
        selectedItem={currentSlide}
        onChange={setCurrentSlide}
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        infiniteLoop={true}
        swipeable={true}
        emulateTouch={true}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="react-slide"
            role="group"
            aria-roledescription="slide"
          >
            <img src={slide.img} alt={slide.alt} />
            <h3>{slide.title}</h3>
            <p>{slide.text}</p>
            <span className="text-stone-700 underline">{slide.link}</span>
          </div>
        ))}
      </Carousel>
      <div className="flex justify-center gap-4 mt-4">
        <button type="button" className="carousel-btn" onClick={prev}>
          Previous
        </button>
        <button type="button" className="carousel-btn" onClick={next}>
          Next
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === currentSlide ? 'true' : undefined}
            className={`w-3 h-3 rounded-full border-none cursor-pointer p-0 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${i === currentSlide ? 'bg-stone-800' : 'bg-stone-300 hover:bg-stone-400'}`}
          />
        ))}
      </div>
    </div>
  )
}
