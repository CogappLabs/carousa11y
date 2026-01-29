import Flicking from '@egjs/react-flicking'
import { useCallback, useRef, useState } from 'react'
import { slides } from '../../data/slides'
import '@egjs/flicking/dist/flicking.css'

export default function FlickingReact() {
  const flickingRef = useRef<Flicking>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handlePrev = async () => {
    try {
      await flickingRef.current?.prev()
    } catch {}
  }
  const handleNext = async () => {
    try {
      await flickingRef.current?.next()
    } catch {}
  }
  const handleChanged = useCallback((e: any) => setSelectedIndex(e.index), [])
  const goTo = useCallback((index: number) => {
    flickingRef.current?.moveTo(index).catch(() => {})
  }, [])

  return (
    <div role="region" aria-label="Featured content carousel">
      <Flicking
        ref={flickingRef}
        circular={true}
        align="prev"
        panelsPerView={1}
        inputType={['touch', 'mouse']}
        moveType="snap"
        preventDefaultOnDrag={true}
        onChanged={handleChanged}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flicking-panel w-full px-4"
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
      </Flicking>
      <div className="flex justify-center gap-4 mt-4">
        <button type="button" onClick={handlePrev} className="carousel-btn">
          Previous
        </button>
        <button type="button" onClick={handleNext} className="carousel-btn">
          Next
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full border-none p-0 cursor-pointer ${i === selectedIndex ? 'bg-stone-800' : 'bg-stone-300'}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === selectedIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  )
}
