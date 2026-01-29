declare module 'siema' {
  interface SiemaOptions {
    selector?: string | Element
    duration?: number
    easing?: string
    perPage?: number
    startIndex?: number
    draggable?: boolean
    multipleDrag?: boolean
    threshold?: number
    loop?: boolean
    rtl?: boolean
    onInit?: () => void
    onChange?: () => void
  }

  export default class Siema {
    constructor(options?: SiemaOptions)
    next(howMany?: number, callback?: () => void): void
    prev(howMany?: number, callback?: () => void): void
    goTo(index: number, callback?: () => void): void
    destroy(restoreMarkup?: boolean, callback?: () => void): void
    currentSlide: number
  }
}

declare module '@glidejs/glide' {
  interface GlideOptions {
    type?: 'slider' | 'carousel'
    startAt?: number
    perView?: number
    focusAt?: number | string
    gap?: number
    autoplay?: number | boolean
    hoverpause?: boolean
    keyboard?: boolean
    bound?: boolean
    swipeThreshold?: number | boolean
    dragThreshold?: number | boolean
    perSwipe?: string
    touchRatio?: number
    touchAngle?: number
    animationDuration?: number
    rewind?: boolean
    rewindDuration?: number
    animationTimingFunc?: string
    direction?: 'ltr' | 'rtl'
    peek?: number | { before: number; after: number }
    breakpoints?: Record<number, Partial<GlideOptions>>
    classes?: Record<string, string>
    throttle?: number
  }

  export default class Glide {
    constructor(selector: string, options?: GlideOptions)
    mount(extensions?: Record<string, unknown>): this
    destroy(): void
    go(pattern: string): void
    update(settings?: GlideOptions): this
    disable(): this
    enable(): this
    index: number
  }
}

declare module 'react-slick' {
  import { Component, ReactNode } from 'react'

  interface Settings {
    dots?: boolean
    infinite?: boolean
    speed?: number
    slidesToShow?: number
    slidesToScroll?: number
    autoplay?: boolean
    arrows?: boolean
    pauseOnHover?: boolean
    children?: ReactNode
  }

  export default class Slider extends Component<Settings> {}
}
