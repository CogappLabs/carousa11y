# Carousa11y

**Carousel Accessibility Comparison**

Compare the accessibility of 11 popular carousel libraries with real implementations, WCAG compliance analysis, and interactive testing.

**[View the site →](https://cogapplabs.github.io/carousa11y/)**

## Libraries Tested

| Library | Score | Workarounds Needed |
|---------|-------|-------------------|
| Embla Carousel | 100% | None |
| Flicking | 100% | None |
| Swiper | 84.9% | None |
| Siema | 85.7% | None |
| Flickity | 74.6% | tabindex management |
| Keen Slider | 66.7% | None |
| tiny-slider | 58.5% | tabindex + nav buttons |
| React Slick | 57.4% | tabindex management |
| Splide | 53.8% | None (library-level issues) |
| Glide | 44.4% | aria-current |
| react-responsive-carousel | 100% | None |

Scores from [isitaccessible.dev](https://isitaccessible.dev)

## Features

- Vanilla JS and React implementations for each library
- Interactive axe-core accessibility testing
- WCAG 2.1 AA compliance documentation
- Workarounds for common accessibility issues

## Development

```bash
npm install
npm run dev
```

## License

MIT
