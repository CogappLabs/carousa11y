import { useKeenSlider } from 'keen-slider/react'
import { useState } from 'react'
import { slides } from '../../data/slides'
import 'keen-slider/keen-slider.min.css'

export default function KeenReact() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),
  })

  return (
    <div role="region" aria-label="Featured content carousel">
      <div ref={sliderRef} className="keen-slider">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="keen-slider__slide px-4"
            role="group"
            aria-roledescription="slide"
          >
            <img
              src={slide.img}
              alt={slide.alt}
              className="w-full h-52 object-cover rounded"
            />
            <h3 className="mt-4 mb-2 text-xl">{slide.title}</h3>
            <p className="m-0 mb-3 text-stone-600">{slide.text}</p>
            <span className="text-stone-700 underline">{slide.link}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={() => instanceRef.current?.prev()}
          className="carousel-btn"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => instanceRef.current?.next()}
          className="carousel-btn"
        >
          Next
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => instanceRef.current?.moveToIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === currentSlide ? 'true' : undefined}
            className={`w-3 h-3 rounded-full border-none cursor-pointer p-0 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${i === currentSlide ? 'bg-stone-800' : 'bg-stone-300 hover:bg-stone-400'}`}
          />
        ))}
      </div>
    </div>
  )
}
