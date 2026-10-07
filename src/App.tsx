import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CookieConsent from './components/CookieConsent'
import { sectionPages } from './pages/sections'
import loadingLogo from '../assets/images/logo/wedesygn-text.png'
import '../assets/fonts/fonts.css'
import '../assets/icon/icomoon/style.css'
import '../assets/css/bootstrap.min.css'
import '../assets/css/swiper-bundle.min.css'
import '../assets/css/animate.css'
import '../assets/css/odometer.min.css'
import '../assets/css/slick.css'
import '../assets/css/slick.theme.css'
import '../assets/css/styles.css'
import './index.css'

const HomePage = lazy(() => import('./pages/HomePage'))
// const LandingPage = lazy(() => import('./pages/LandingPage'))
// const BlogStandardPage = lazy(() => import('./pages/BlogStandardPage'))
// const BlogTwoColumnsPage = lazy(() => import('./pages/BlogTwoColumnsPage'))
// const BlogThreeColumnsPage = lazy(() => import('./pages/BlogThreeColumnsPage'))
// const BlogSinglePage = lazy(() => import('./pages/BlogSinglePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const SectionPage = lazy(() => import('./pages/SectionPage'))

function RouteLoading() {
  return (
    <div className="route-loading" aria-live="polite">
      <img src={loadingLogo} alt="wedesygn" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          {sectionPages.map((page) => <Route key={page.path} path={page.path} element={<SectionPage {...page} />} />)}
          {/* <Route path="/landing" element={<LandingPage />} />
          <Route path="/blog-standard" element={<BlogStandardPage />} />
          <Route path="/blog-two-columns" element={<BlogTwoColumnsPage />} />
          <Route path="/blog-three-columns" element={<BlogThreeColumnsPage />} />
          <Route path="/blog-single" element={<BlogSinglePage />} /> */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <CookieConsent />
    </BrowserRouter>
  )
}

export default App
