import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { company, footerNav } from '../../data/site'
import { Container } from '../ui/Section'
import { Logo } from '../ui/Logo'

export function Footer() {
  return (
    <footer className="border-t hairline bg-ink-950">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 font-serif text-xl text-ivory-200 italic">{company.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory-400">
              Production cue planning for theatre companies, touring productions and live-event teams.
            </p>
            <a
              href={`mailto:${company.email}`}
              className="mt-6 inline-flex items-center gap-2 text-sm text-ivory-200 underline-offset-4 hover:text-brass-300 hover:underline"
            >
              <Mail className="h-4 w-4" /> {company.email}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="eyebrow !text-ivory-500">{group.heading}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-sm text-ivory-300 transition-colors hover:text-ivory-50">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t hairline pt-8 text-xs text-ivory-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name} · {company.domain}
          </p>
          <p>Stagewoven plans and documents cues. It does not control lighting desks, sound consoles or show equipment.</p>
        </div>
      </Container>
    </footer>
  )
}
