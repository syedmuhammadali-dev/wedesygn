export type SectionPageInfo = { path: string; file: string; title: string; heading: string; description: string }

export const menu = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'About us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
]

export const sectionPages: SectionPageInfo[] = [
  { path: '/portfolio', file: 'portfolio.html', heading: 'Portfolio', title: 'Portfolio — wedesygn', description: 'Selected projects by wedesygn across brand identity, motion and web design.' },
  { path: '/services', file: 'services.html', heading: 'Services', title: 'Services — wedesygn', description: 'wedesygn services: brand identity, brand in motion, web design and web development.' },
  { path: '/about-us', file: 'about-us.html', heading: 'About us', title: 'About us — wedesygn', description: 'About wedesygn, a digital studio creating bold, functional digital experiences.' },
  { path: '/contact', file: 'contact.html', heading: 'Contact', title: 'Contact — wedesygn', description: 'Contact wedesygn to start a project: hello@wedesygn.com.' },
]
