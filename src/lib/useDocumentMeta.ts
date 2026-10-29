import { useEffect } from 'react'
import { company } from '../data/site'

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/** Sets the page title, description and Open Graph tags for client-side routes. */
export function useDocumentMeta(title: string, description: string, path = '') {
  useEffect(() => {
    const full = title ? `${title} — ${company.name}` : `${company.name} — ${company.tagline}`
    document.title = full
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', full)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', `${company.url}${path}`)
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) canonical.href = `${company.url}${path}`
  }, [title, description, path])
}
