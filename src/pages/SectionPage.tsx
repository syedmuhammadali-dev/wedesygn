import { useEffect } from 'react'
import { menu, type SectionPageInfo } from './sections'

const logo = '/images/logo/logo-icon-red.png'

export default function SectionPage({ path, heading, title, description }: SectionPageInfo) {
  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://wedesygn.com${path}`)
  }, [path, title, description])

  return (
    <div className="section-page">
      <header className="section-page__header">
        <a href="/" aria-label="wedesygn home"><img src={logo} alt="wedesygn" width="40" height="40" /></a>
        <nav aria-label="Main">
          {menu.map((item) => <a key={item.href} href={item.href} aria-current={item.href === path ? 'page' : undefined}>{item.label}</a>)}
        </nav>
      </header>
      <main className="section-page__main">
        <h1>{heading}</h1>
      </main>
    </div>
  )
}
