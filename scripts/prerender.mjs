// Post-build step: bakes real HTML into the static pages so search engines
// see content, headings and per-page metadata without running JavaScript.
// React still mounts over the top in the browser (createRoot replaces #root).
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = (file) => resolve(root, 'dist', file)
const shell = readFileSync(dist('index.html'), 'utf-8')
const emptyRoot = '<div id="root"></div>'
if (!shell.includes(emptyRoot)) throw new Error('dist/index.html root placeholder not found')

const site = 'https://wedesygn.com'
const aliases = {
  'index.html': '/', 'landing.html': '/landing',
  'blog-standard.html': '/blog-standard', 'blog-two-columns.html': '/blog-two-columns',
  'blog-three-columns.html': '/blog-three-columns', 'blog-single.html': '/blog-single',
  '404.html': '/404',
}

// Mirrors buildMarkup() in src/legacy/LegacyPage.tsx using string transforms
// (no DOMParser in Node): strip scripts and rewrite asset/page links.
function homeMarkup() {
  const source = readFileSync(resolve(root, 'src/page-source/index.html'), 'utf-8')
  let body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? ''
  body = body.replace(/<script\b[\s\S]*?<\/script>/gi, '')
  body = body.replace(/(=\s*["'])assets\//g, '$1/').replace(/(url\(\s*["']?)assets\//g, '$1/')
  for (const [from, to] of Object.entries(aliases)) body = body.replaceAll(`href="${from}"`, `href="${to}"`)
  return body
}

function withMeta(html, { title, description, path, robots }) {
  const url = `${site}${path}`
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
  if (robots) out = out.replace(/(<meta name="robots" content=")[^"]*(")/, `$1${robots}$2`)
  return out
}

// Home
writeFileSync(dist('index.html'), shell.replace(emptyRoot, `<div id="root">${homeMarkup()}</div>`))

// Privacy policy: render the real React page so the copy lives in one place.
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { default: PrivacyPolicyPage } = await vite.ssrLoadModule('/src/pages/PrivacyPolicyPage.tsx')
  const privacy = withMeta(shell, {
    title: 'Privacy Policy — wedesygn',
    description: 'wedesygn privacy policy covering analytics, contact forms and website data.',
    path: '/privacy-policy',
  }).replace(emptyRoot, `<div id="root">${renderToString(createElement(PrivacyPolicyPage))}</div>`)
  writeFileSync(dist('privacy-policy.html'), privacy)
} finally {
  await vite.close()
}

// Real 404 shell: served with a 404 status by .htaccess, React renders NotFoundPage.
writeFileSync(dist('404.html'), withMeta(shell, {
  title: 'Page not found — wedesygn',
  description: 'The page you are looking for could not be found.',
  path: '/404',
  robots: 'noindex, follow',
}))

console.log('Prerendered: index.html, privacy-policy.html, 404.html')
