import Accessibility from 'embla-carousel-accessibility'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import { slides } from '../../data/slides'

export default function EmblaReact() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Accessibility() as any,
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(
    () => (emblaApi as any)?.goToPrev(),
    [emblaApi],
  )
  const scrollNext = useCallback(
    () => (emblaApi as any)?.goToNext(),
    [emblaApi],
  )
  const scrollTo = useCallback(
    (index: number) => (emblaApi as any)?.goTo(index),
    [emblaApi],
  )

  useEffect(() => {
    if (!emblaApi) return
    const api = emblaApi as any
    const onSelect = () => setSelectedIndex(api.selectedSnap())
    api.on('select', onSelect)
    onSelect()
    return () => api.off('select', onSelect)
  }, [emblaApi])

  return (
    <div className="overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 px-4">
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
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button type="button" onClick={scrollPrev} className="carousel-btn">
          Previous
        </button>
        <button type="button" onClick={scrollNext} className="carousel-btn">
          Next
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className={`w-3 h-3 rounded-full border-none p-0 cursor-pointer ${i === selectedIndex ? 'bg-stone-800' : 'bg-stone-300'}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === selectedIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  )
}
