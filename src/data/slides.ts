export interface Slide {
  img: string
  alt: string
  title: string
  text: string
  link: string
}

export const slides: Slide[] = [
  {
    img: 'https://picsum.photos/seed/1/400/200',
    alt: 'Mountain landscape with snow-capped peaks',
    title: 'Slide 1: Mountains',
    text: 'Beautiful mountain scenery with snow-capped peaks.',
    link: 'Learn more about mountains',
  },
  {
    img: 'https://picsum.photos/seed/2/400/200',
    alt: 'Ocean waves crashing on rocky shore',
    title: 'Slide 2: Ocean',
    text: 'Powerful ocean waves meeting the rocky coastline.',
    link: 'Explore ocean destinations',
  },
  {
    img: 'https://picsum.photos/seed/3/400/200',
    alt: 'Dense forest with tall evergreen trees',
    title: 'Slide 3: Forest',
    text: 'A peaceful walk through the evergreen forest.',
    link: 'Discover forest trails',
  },
]
