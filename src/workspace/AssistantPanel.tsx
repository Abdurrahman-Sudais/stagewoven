import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Info, MessageSquare } from 'lucide-react'
import { EXAMPLE_QUESTIONS, answer, type AssistantAnswer } from './assistant'
import { useWorkspace } from './store'
import { cn } from '../lib/cn'

/** “Ask about this production” — answers from the demo records and lists the records it used. */
export function AssistantPanel() {
  const { state } = useWorkspace()
  const [q, setQ] = useState('')
  const [asked, setAsked] = useState<{ q: string; a: AssistantAnswer } | null>(null)
  const ask = (question: string) => {
    if (!question.trim()) return
    setAsked({ q: question.trim(), a: answer(question, state) })
    setQ('')
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    ask(q)
  }
  return (
    <section className="panel overflow-hidden" aria-labelledby="assistant-title">
      <header className="flex items-center gap-2 border-b hairline px-4 py-3">
        <Bot className="h-4 w-4 text-brass-300" aria-hidden />
        <h2 id="assistant-title" className="text-sm text-ivory-50">Ask about this production</h2>
        <span className="rounded-full border border-brass-400/25 px-2 py-0.5 font-mono text-[0.6rem] tracking-wider text-brass-300 uppercase">Simulated assistant</span>
      </header>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((e) => (
            <button key={e} type="button" onClick={() => ask(e)} className="rounded-full border border-ivory-50/10 px-3 py-1.5 text-[0.75rem] text-ivory-300 hover:border-brass-400/40 hover:text-ivory-50">{e}</button>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <label htmlFor="assistant-q" className="sr-only">Ask a question about the demo production</label>
          <input id="assistant-q" className="h-9 w-full rounded-lg border border-ivory-50/10 bg-ink-900 px-3 text-[0.85rem] text-ivory-100 outline-none placeholder:text-ivory-500 focus:border-brass-400/60" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. What happened to LX-004?" maxLength={200} />
          <button type="submit" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-brass-400 px-3 text-[0.8rem] font-medium text-ink-950 hover:bg-brass-300"><MessageSquare className="h-3.5 w-3.5" aria-hidden /> Ask</button>
        </form>
        {asked && (
          <div className={cn('rounded-lg border p-4', asked.a.kind === 'refusal' ? 'border-curtain-500/40 bg-curtain-500/[0.08]' : 'border-ivory-50/10 bg-ink-900')} aria-live="polite">
            <p className="text-[0.7rem] text-ivory-500">“{asked.q}”</p>
            <h3 className="mt-1 text-ivory-50">{asked.a.title}</h3>
            <ul className="mt-2 space-y-1.5 text-[0.85rem] text-ivory-300">{asked.a.lines.map((l) => <li key={l}>{l}</li>)}</ul>
            {asked.a.sources.length > 0 && <p className="mt-3 font-mono text-[0.68rem] text-ivory-500">From {asked.a.sources.length} record{asked.a.sources.length > 1 ? 's' : ''}: {asked.a.sources.join(', ')}</p>}
            {asked.a.links.length > 0 && <div className="mt-3 flex flex-wrap gap-3">{asked.a.links.map((l) => <Link key={l.to} to={l.to} className="inline-flex items-center gap-1 text-[0.75rem] text-brass-300 hover:underline">{l.label} <ArrowRight className="h-3 w-3" aria-hidden /></Link>)}</div>}
          </div>
        )}
        <p className="flex items-start gap-1.5 text-[0.68rem] text-ivory-500"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> Answers are computed from this demo’s records and list the records used. No language model is called. It never rewrites the script, decides design intent or calls cues live.</p>
      </div>
    </section>
  )
}
