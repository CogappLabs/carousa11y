export interface Slide {
  img: string
  alt: string
  title: string
  text: string
  link: string
}

export interface CarouselMeta {
  name: string
  version: string
  score: string
  stars: string
  notes: string
  github: string
  demo?: string
  npm: string
  nav: 'below' | 'overlay' | 'built-in'
  dots: 'custom' | 'built-in' | 'plugin' | 'component'
  hasReact?: boolean
  react?: boolean
}

export type CarouselId =
  | 'embla'
  | 'flicking'
  | 'siema'
  | 'swiper'
  | 'flickity'
  | 'keen'
  | 'tiny'
  | 'splide'
  | 'glide'
  | 'react-slick'
  | 'react-responsive'
