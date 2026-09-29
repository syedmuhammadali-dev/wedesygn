import { useEffect, useMemo, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import homeSource from './page-source/index.html?raw'
import landingSource from './page-source/landing.html?raw'
import standardSource from './page-source/blog-standard.html?raw'
import twoColumnsSource from './page-source/blog-two-columns.html?raw'
import threeColumnsSource from './page-source/blog-three-columns.html?raw'
import singleSource from './page-source/blog-single.html?raw'
import notFoundSource from './page-source/404.html?raw'
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

type Page = { source: string; title: string }

const pages: Record<string, Page> = {
  '/': { source: homeSource, title: 'Wedesygn — Digital Design & Development' },
  '/landing': { source: landingSource, title: 'Wedesygn — Digital Design & Development' },
  '/blog-standard': { source: standardSource, title: 'Wedesygn — Journal' },
  '/blog-two-columns': { source: twoColumnsSource, title: 'Wedesygn — Journal' },
  '/blog-three-columns': { source: threeColumnsSource, title: 'Wedesygn — Journal' },
  '/blog-single': { source: singleSource, title: 'Wedesygn — Blog Article' },
  '/404': { source: notFoundSource, title: 'Wedesygn — Page Not Found' },
}

const aliases: Record<string, string> = {
  'index.html': '/', 'landing.html': '/landing',
  'blog-standard.html': '/blog-standard', 'blog-two-columns.html': '/blog-two-columns',
  'blog-three-columns.html': '/blog-three-columns', 'blog-single.html': '/blog-single',
  '404.html': '/404',
}

const scripts = [
  'jquery.min.js', 'bootstrap.min.js', 'jquery.nice-select.min.js', 'swiper-bundle.min.js',
  'slick.min.js', 'odometer.min.js', 'carousel.js', 'infinityslide.js', 'ScrollSmooth.js',
  'gsap.min.js', 'SplitText.min.js', 'ScrollTrigger.min.js', 'ScrollToPlugin.min.js',
  'gsapAnimation.js', 'main.js',
]

function rewriteBrand(value: string) {
  return value.replace(/\bDAVIES\b/g, 'WEDESYGN').replace(/\bDavies\b/g, 'Wedesygn').replace(/\bdavies\b/g, 'wedesygn')
}

function buildMarkup(source: string) {
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? ''
  const document = new DOMParser().parseFromString(`<body>${body}</body>`, 'text/html')
  const root = document.body
  root.querySelectorAll('script').forEach((element) => element.remove())
  root.querySelectorAll('*').forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      let value = attribute.value
      if (value.includes('assets/')) {
        value = value.replace(/(^|[\s("'])assets\//g, '$1/')
      }
      for (const [oldPath, newPath] of Object.entries(aliases)) {
        if (value.startsWith(oldPath)) value = value.replace(oldPath, newPath)
      }
      if (value !== attribute.value) element.setAttribute(attribute.name, value)
    }
  })
  root.querySelectorAll('a[href="version-2.html"]').forEach((element) => element.closest('.effectFade')?.remove())
  root.innerHTML = root.innerHTML.replace(/davies@gmail\.com/gi, 'hello@wedesygn.com')
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    node.nodeValue = rewriteBrand(node.nodeValue ?? '')
    node = walker.nextNode()
  }
  root.querySelectorAll<HTMLElement>('[alt], [title], [aria-label]').forEach((element) => {
    for (const attribute of ['alt', 'title', 'aria-label']) {
      const value = element.getAttribute(attribute)
      if (value) element.setAttribute(attribute, rewriteBrand(value))
    }
  })
  return root.innerHTML
}

function setMeta(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`)
  if (!element) { element = document.createElement('meta'); element.setAttribute('name', name); document.head.appendChild(element) }
  element.setAttribute('content', content)
}

function ContactFormBridge() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>('.form-cta')
    if (!form) return
    const fields = form.querySelectorAll<HTMLInputElement>('.tf-input')
    const status = document.createElement('p')
    status.className = 'react-form-status text-body-1'
    form.querySelector('.form-action')?.appendChild(status)
    const submit = async (event: SubmitEvent) => {
      event.preventDefault()
      const [name, email, projectDetails] = [...fields].map((field) => field.value.trim())
      const selects = [...form.querySelectorAll<HTMLElement>('.nice-select .current')].map((item) => item.textContent?.trim() ?? '')
      if (!name || !email || !projectDetails) { status.textContent = 'Please complete all required fields.'; return }
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')
      button?.setAttribute('disabled', 'true')
      status.textContent = 'Sending your message…'
      try {
        const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api/create-user' : '/api/create-user')
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, interestedIn: selects[0], budgetInUsd: selects[1], projectDetails }) })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Unable to send message')
        status.textContent = 'Thanks — your message has been received.'
        form.reset()
      } catch (error) { status.textContent = error instanceof Error ? error.message : 'Unable to send message.' }
      finally { button?.removeAttribute('disabled') }
    }
    form.addEventListener('submit', submit)
    return () => { form.removeEventListener('submit', submit); status.remove() }
  }, [])
  return null
}

function LegacyPage({ page }: { page: Page }) {
  const navigate = useNavigate()
  const location = useLocation()
  const loaded = useRef(false)
  const markup = useMemo(() => buildMarkup(page.source), [page.source])

  useEffect(() => {
    const path = aliases[location.pathname] ?? location.pathname
    const description = path.startsWith('/blog-') ? 'Insights and ideas from Wedesygn on design, development and digital experiences.' : 'Wedesygn creates bold, functional digital experiences through strategy, design and development.'
    document.title = page.title
    setMeta('description', description)
    setMeta('author', 'Wedesygn')
    document.body.className = 'counter-scroll'
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical) }
    canonical.setAttribute('href', `https://wedesygn.com${path}`)
    const preloaderFallback = window.setTimeout(() => {
      document.querySelector('.preloader')?.remove()
    }, 5000)
    if (loaded.current) return () => window.clearTimeout(preloaderFallback)
    loaded.current = true
    const loadScripts = async () => {
      for (const file of scripts) await new Promise<void>((resolve) => { const script = document.createElement('script'); script.src = `/js/${file}`; script.onload = () => resolve(); script.onerror = () => resolve(); document.body.appendChild(script) })
    }
    void loadScripts()
    return () => window.clearTimeout(preloaderFallback)
  }, [location.pathname, page])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest('a')
    const href = anchor?.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return
    const cleanPath = aliases[href] ?? href
    if (cleanPath.startsWith('/')) { event.preventDefault(); navigate(cleanPath) }
  }

  return <><div onClick={handleClick} dangerouslySetInnerHTML={{ __html: markup }} /><ContactFormBridge key={location.pathname} /></>
}

function App() {
  return <BrowserRouter><Routes>{Object.entries(pages).map(([path, page]) => <Route key={path} path={path} element={<LegacyPage page={page} />} />)}<Route path="*" element={<LegacyPage page={pages['/404']} />} /></Routes></BrowserRouter>
}

export default App
