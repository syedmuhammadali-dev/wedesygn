import source from '../page-source/blog-standard.html?raw'
import { LegacyPage } from '../legacy/LegacyPage'

const scripts = ['bootstrap.min.js', 'jquery.min.js', 'swiper-bundle.min.js', 'carousel.js', 'infinityslide.js', 'ScrollSmooth.js', 'gsap.min.js', 'gsapAnimation.js', 'SplitText.min.js', 'ScrollTrigger.min.js', 'odometer.min.js', 'jquery.nice-select.min.js', 'main.js']

export default function BlogStandardPage() {
  return <LegacyPage source={source} title="wedesygn — Journal" scripts={scripts} />
}
