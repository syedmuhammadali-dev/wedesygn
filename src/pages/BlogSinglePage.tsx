import source from '../page-source/blog-single.html?raw'
import { LegacyPage } from '../legacy/LegacyPage'

const scripts = ['bootstrap.min.js', 'jquery.min.js', 'swiper-bundle.min.js', 'carousel.js', 'infinityslide.js', 'ScrollSmooth.js', 'gsap.min.js', 'gsapAnimation.js', 'SplitText.min.js', 'ScrollTrigger.min.js', 'odometer.min.js', 'jquery.nice-select.min.js', 'main.js']

export default function BlogSinglePage() {
  return <LegacyPage source={source} title="wedesygn — Blog Article" scripts={scripts} />
}
