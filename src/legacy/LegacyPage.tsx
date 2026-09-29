import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type LegacyPageProps = {
  source: string
  title: string
  scripts: string[]
}

const aliases: Record<string, string> = {
  'index.html': '/', 'landing.html': '/landing',
  'blog-standard.html': '/blog-standard', 'blog-two-columns.html': '/blog-two-columns',
  'blog-three-columns.html': '/blog-three-columns', 'blog-single.html': '/blog-single',
  '404.html': '/404',
}

const loadedScripts = new Set<string>()
let scriptQueue = Promise.resolve()

function buildMarkup(source: string) {
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? ''
  const document = new DOMParser().parseFromString(`<body>${body}</body>`, 'text/html')
  const root = document.body
  root.querySelectorAll('script').forEach((element) => element.remove())
  root.querySelectorAll('*').forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      let value = attribute.value
      if (value.includes('assets/')) value = value.replace(/(^|[\s("'])assets\//g, '$1/')
      for (const [oldPath, newPath] of Object.entries(aliases)) {
        if (value.startsWith(oldPath)) value = value.replace(oldPath, newPath)
      }
      if (value !== attribute.value) element.setAttribute(attribute.name, value)
    }
  })
  root.querySelectorAll('a[href="version-2.html"]').forEach((element) => element.closest('.effectFade')?.remove())
  return root.innerHTML
}

function setMeta(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`)
  if (!element) { element = document.createElement('meta'); element.setAttribute('name', name); document.head.appendChild(element) }
  element.setAttribute('content', content)
}

function revealRouteContent() {
  document.querySelectorAll<HTMLElement>('.preloader').forEach((element) => element.remove())
  document.querySelectorAll<HTMLElement>('.effectFade').forEach((element, index) => {
    element.style.transition = `opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(index * 0.015, 0.25)}s`
    element.style.opacity = '1'
    element.style.transform = 'none'
  })
}

function startAutoplayVideos() {
  document.querySelectorAll<HTMLVideoElement>('video[autoplay]').forEach((video) => {
    video.muted = true
    video.setAttribute('playsinline', '')
    void video.play().catch(() => {
      // Browsers can still block autoplay; the muted attribute allows the next
      // browser paint or user interaction to start it normally.
    })
  })
}

function loadScript(file: string) {
  if (loadedScripts.has(file)) return Promise.resolve()
  loadedScripts.add(file)
  return new Promise<void>((resolve) => {
    const script = document.createElement('script')
    script.src = `/js/${file}`
    script.onload = () => resolve()
    script.onerror = () => resolve()
    document.body.appendChild(script)
  })
}

function loadLegacyScripts(scripts: string[]) {
  scriptQueue = scriptQueue.then(async () => {
    for (const file of scripts) await loadScript(file)
    window.dispatchEvent(new Event('load'))
  })
  return scriptQueue
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

export function LegacyPage({ source, title, scripts }: LegacyPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const scriptsStarted = useRef(false)
  const markup = useMemo(() => buildMarkup(source), [source])

  useEffect(() => {
    const path = aliases[location.pathname] ?? location.pathname
    const description = path.startsWith('/blog-') ? 'Insights and ideas from Wedesygn on design, development and digital experiences.' : 'Wedesygn creates bold, functional digital experiences through strategy, design and development.'
    document.title = title
    setMeta('description', description)
    setMeta('author', 'Wedesygn')
    document.body.className = 'counter-scroll'
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical) }
    canonical.setAttribute('href', `https://wedesygn.com${path}`)
    const preloaderFallback = window.setTimeout(() => document.querySelector('.preloader')?.remove(), 5000)
    const videoStart = window.setTimeout(startAutoplayVideos, 0)

    if (scriptsStarted.current) {
      const routeReveal = window.setTimeout(revealRouteContent, 30)
      return () => { window.clearTimeout(preloaderFallback); window.clearTimeout(routeReveal); window.clearTimeout(videoStart) }
    }
    scriptsStarted.current = true
    const hadLoadedLegacyScripts = loadedScripts.size > 0
    void loadLegacyScripts(scripts).then(() => {
      if (hadLoadedLegacyScripts) revealRouteContent()
    })
    return () => { window.clearTimeout(preloaderFallback); window.clearTimeout(videoStart) }
  }, [location.pathname, scripts, title])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest('a')
    const href = anchor?.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return
    const cleanPath = aliases[href] ?? href
    if (cleanPath.startsWith('/')) { event.preventDefault(); navigate(cleanPath) }
  }

  return <><div onClick={handleClick} dangerouslySetInnerHTML={{ __html: markup }} /><ContactFormBridge key={location.pathname} /></>
}
