import { ArrowLeft } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Section'

export default function NotFound() {
  useDocumentMeta('Page not found', 'This page could not be found.')
  return (
    <section className="stage-light flex min-h-[80dvh] items-center pt-24">
      <Container className="text-center">
        <p className="eyebrow">Error 404 · Cue not found</p>
        <h1 className="mt-5 font-serif text-5xl font-light text-ivory-50 sm:text-7xl">This page missed its cue.</h1>
        <p className="mx-auto mt-5 max-w-md text-ivory-300">The page you were looking for has been cut from this draft, or never made it into the script.</p>
        <ButtonLink to="/" variant="secondary" className="mt-9">
          <ArrowLeft className="h-4 w-4" /> Back to the home page
        </ButtonLink>
      </Container>
    </section>
  )
}
