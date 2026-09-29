import source from '../page-source/404.html?raw'
import { LegacyPage } from '../legacy/LegacyPage'

const scripts = ['bootstrap.min.js', 'jquery.min.js', 'swiper-bundle.min.js', 'carousel.js', 'infinityslide.js', 'ScrollSmooth.js', 'gsap.min.js', 'gsapAnimation.js', 'SplitText.min.js', 'ScrollTrigger.min.js', 'odometer.min.js', 'jquery.nice-select.min.js', 'main.js']

export default function NotFoundPage() {
  return <LegacyPage source={source} title="Wedesygn — Page Not Found" scripts={scripts} />
}
