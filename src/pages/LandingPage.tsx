import source from '../page-source/landing.html?raw'
import { LegacyPage } from '../legacy/LegacyPage'

const scripts = ['jquery.min.js', 'bootstrap.min.js', 'gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js', 'ScrollSmoother.min.js', 'gsapAnimation.js']

export default function LandingPage() {
  return <LegacyPage source={source} title="Wedesygn — Digital Design & Development" scripts={scripts} />
}
