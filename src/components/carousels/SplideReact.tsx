// @ts-expect-error - package exports issue
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { slides } from '../../data/slides'
import '@splidejs/splide/css'

export default function SplideReact() {
  return (
    <div>
      <Splide
        options={{ type: 'loop', perPage: 1 }}
        aria-label="Splide carousel"
      >
        {slides.map((slide, i) => (
          <SplideSlide key={i}>
            <div className="px-4" role="group" aria-roledescription="slide">
              <img
                src={slide.img}
                alt={slide.alt}
                width={400}
                height={200}
                loading="lazy"
                decoding="async"
                className="w-full h-52 object-cover rounded"
              />
              <h3 className="mt-4 mb-2 text-xl">{slide.title}</h3>
              <p className="m-0 mb-3 text-stone-600">{slide.text}</p>
              <span className="text-stone-700 underline">{slide.link}</span>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}
