import source from '../page-source/index.html?raw'
import { LegacyPage } from '../legacy/LegacyPage'

const scripts = ['jquery.min.js', 'bootstrap.min.js', 'jquery.nice-select.min.js', 'swiper-bundle.min.js', 'slick.min.js', 'odometer.min.js', 'carousel.js', 'infinityslide.js', 'ScrollSmooth.js', 'gsap.min.js', 'SplitText.min.js', 'ScrollTrigger.min.js', 'ScrollToPlugin.min.js', 'gsapAnimation.js', 'main.js']

export default function HomePage() {
  return <LegacyPage source={source} title="wedesygn — Digital Design & Development" scripts={scripts} />
}
