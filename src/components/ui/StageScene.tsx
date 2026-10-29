import { cn } from '../../lib/cn'

/**
 * Atmospheric, art-directed stand-ins for editorial photography.
 * Pass `src` to swap in licensed photography without changing layouts.
 */
export type SceneVariant = 'rig' | 'stage' | 'script' | 'ghostlight'

type Props = {
  variant: SceneVariant
  alt: string
  caption?: string
  src?: string
  className?: string
}

export function StageScene({ variant, alt, caption, src, className }: Props) {
  return (
    <figure className={cn('group relative overflow-hidden rounded-2xl border hairline bg-ink-900 grain', className)}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div role="img" aria-label={alt} className="h-full w-full">
          {variant === 'rig' && <Rig />}
          {variant === 'stage' && <Stage />}
          {variant === 'script' && <Script />}
          {variant === 'ghostlight' && <GhostLight />}
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
      {caption && (
        <figcaption className="absolute bottom-0 left-0 p-4 font-mono text-[0.68rem] tracking-[0.14em] text-ivory-300 uppercase">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  preserveAspectRatio: 'xMidYMid slice',
  className: 'h-full w-full transition-transform duration-[1.6s] ease-out group-hover:scale-[1.025]',
}

function Rig() {
  const fixtures = [70, 150, 230, 310, 390, 470, 550]
  return (
    <svg viewBox="0 0 620 420" {...svgProps}>
      <defs>
        <linearGradient id="rig-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15110d" />
          <stop offset="1" stopColor="#070605" />
        </linearGradient>
        <linearGradient id="rig-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c27c" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f0c27c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rig-beam-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d2594c" stopOpacity="0.45" />
          <stop offset="1" stopColor="#d2594c" stopOpacity="0" />
        </linearGradient>
        <filter id="rig-blur"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="620" height="420" fill="url(#rig-bg)" />
      <g filter="url(#rig-blur)">
        {fixtures.map((x, i) => (
          <path
            key={x}
            d={`M${x - 6} 92 L${x + (i - 3) * 22 - 70} 420 L${x + (i - 3) * 22 + 70} 420 L${x + 6} 92Z`}
            fill={i === 1 || i === 5 ? 'url(#rig-beam-red)' : 'url(#rig-beam)'}
            opacity={i % 2 ? 0.55 : 0.85}
          />
        ))}
      </g>
      {/* truss */}
      <g stroke="#4a4036" strokeWidth="1.5" fill="none">
        <path d="M0 64H620M0 84H620" />
        {Array.from({ length: 32 }, (_, i) => (
          <path key={i} d={`M${i * 20} 64L${i * 20 + 20} 84`} />
        ))}
      </g>
      {fixtures.map((x) => (
        <g key={x}>
          <rect x={x - 11} y="84" width="22" height="16" rx="3" fill="#1c1814" stroke="#3a332c" />
          <circle cx={x} cy="100" r="5" fill="#fbe2b6" />
        </g>
      ))}
      <path d="M0 360 Q310 340 620 360 V420H0Z" fill="#0a0806" opacity="0.9" />
    </svg>
  )
}

function Stage() {
  return (
    <svg viewBox="0 0 620 420" {...svgProps}>
      <defs>
        <radialGradient id="st-spot" cx="0.5" cy="0.78" r="0.35">
          <stop offset="0" stopColor="#f6d9a8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f6d9a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="st-curtain" x1="0" x2="1">
          <stop offset="0" stopColor="#3b120e" />
          <stop offset="0.5" stopColor="#6e231b" />
          <stop offset="1" stopColor="#2a0c09" />
        </linearGradient>
        <linearGradient id="st-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d9a8" stopOpacity="0.32" />
          <stop offset="1" stopColor="#f6d9a8" stopOpacity="0.04" />
        </linearGradient>
        <filter id="st-blur"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      <rect width="620" height="420" fill="#080706" />
      <path d="M300 0 L230 330 L390 330 L320 0Z" fill="url(#st-cone)" filter="url(#st-blur)" />
      <ellipse cx="310" cy="330" rx="150" ry="26" fill="url(#st-spot)" />
      <rect y="300" width="620" height="120" fill="#100d0b" />
      <ellipse cx="310" cy="318" rx="120" ry="16" fill="#f6d9a8" opacity="0.12" />
      {/* platform bench & figure */}
      <rect x="250" y="292" width="120" height="8" rx="2" fill="#2a231d" />
      <rect x="258" y="300" width="6" height="22" fill="#211b16" />
      <rect x="356" y="300" width="6" height="22" fill="#211b16" />
      <path d="M302 318 v-58 q8-18 16 0 v58 z" fill="#0b0908" />
      <circle cx="310" cy="250" r="10" fill="#0b0908" />
      <rect x="338" y="286" width="22" height="16" rx="2" fill="#18130f" />
      {/* lamp post */}
      <rect x="470" y="150" width="4" height="170" fill="#1b1612" />
      <circle cx="472" cy="148" r="7" fill="#f0c27c" opacity="0.9" />
      <circle cx="472" cy="148" r="30" fill="#f0c27c" opacity="0.08" />
      {/* curtains */}
      <path d="M0 0 H150 Q120 200 140 420 H0Z" fill="url(#st-curtain)" />
      <path d="M620 0 H470 Q500 200 480 420 H620Z" fill="url(#st-curtain)" />
      <path d="M0 0 H620 V40 Q310 70 0 40Z" fill="#4d1712" />
      <g stroke="#000" strokeOpacity="0.25">
        {[30, 60, 90, 120].map((x) => (
          <path key={x} d={`M${x} 40 Q${x - 10} 220 ${x} 420`} fill="none" />
        ))}
        {[500, 530, 560, 590].map((x) => (
          <path key={x} d={`M${x} 40 Q${x + 10} 220 ${x} 420`} fill="none" />
        ))}
      </g>
    </svg>
  )
}

function Script() {
  return (
    <svg viewBox="0 0 620 420" {...svgProps}>
      <defs>
        <radialGradient id="sc-lamp" cx="0.38" cy="0.32" r="0.7">
          <stop offset="0" stopColor="#3a2c1d" />
          <stop offset="1" stopColor="#090807" />
        </radialGradient>
      </defs>
      <rect width="620" height="420" fill="url(#sc-lamp)" />
      <g transform="rotate(-7 300 220)">
        <rect x="150" y="70" width="270" height="340" rx="3" fill="#d9cfbd" />
        <rect x="150" y="70" width="270" height="340" rx="3" fill="#000" opacity="0.18" />
        {Array.from({ length: 15 }, (_, i) => (
          <rect
            key={i}
            x={i % 4 === 0 ? 172 : 196}
            y={100 + i * 19}
            width={i % 4 === 0 ? 70 : 150 + ((i * 37) % 60)}
            height="5"
            rx="2"
            fill="#4b4237"
            opacity={i % 4 === 0 ? 0.85 : 0.5}
          />
        ))}
        <rect x="190" y="210" width="190" height="14" rx="2" fill="#e6a23f" opacity="0.45" />
        <circle cx="398" cy="217" r="13" fill="none" stroke="#b13a2f" strokeWidth="2" />
        <text x="398" y="221" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#b13a2f">Q</text>
        <path d="M405 260 l30 0" stroke="#b13a2f" strokeWidth="2" />
      </g>
      <g transform="rotate(12 470 300)">
        <rect x="420" y="160" width="12" height="190" rx="3" fill="#c7852b" />
        <path d="M420 350 l6 18 l6 -18z" fill="#1b1612" />
      </g>
      <rect x="0" y="0" width="620" height="420" fill="#000" opacity="0.15" />
    </svg>
  )
}

function GhostLight() {
  return (
    <svg viewBox="0 0 620 420" {...svgProps}>
      <defs>
        <radialGradient id="gl-glow" cx="0.5" cy="0.42" r="0.45">
          <stop offset="0" stopColor="#f6d9a8" stopOpacity="0.45" />
          <stop offset="0.4" stopColor="#e6a23f" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="620" height="420" fill="#060505" />
      <rect width="620" height="420" fill="url(#gl-glow)" />
      <path d="M0 330 L620 300 V420 H0Z" fill="#110e0b" />
      <path d="M0 330 L620 300" stroke="#2b2621" />
      {/* seats silhouette */}
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={i * 46} y={390 - (i % 2) * 3} width="38" height="40" rx="6" fill="#0a0807" />
      ))}
      {/* ghost light stand */}
      <rect x="308" y="190" width="4" height="125" fill="#1d1813" />
      <path d="M292 318 h36 l-6 -6 h-24z" fill="#1d1813" />
      <path d="M296 160 h28 l-4 34 h-20z" fill="none" stroke="#2c251f" strokeWidth="2" />
      <circle cx="310" cy="176" r="9" fill="#fff4dc" />
      <circle cx="310" cy="176" r="22" fill="#f6d9a8" opacity="0.25" />
      {/* flats and ladder */}
      <rect x="60" y="120" width="90" height="200" fill="#0f0c0a" stroke="#1f1a15" />
      <rect x="470" y="140" width="110" height="170" fill="#0d0b09" stroke="#1f1a15" />
      <g stroke="#2a231d" strokeWidth="3">
        <path d="M420 320 L445 120 M460 320 L475 120" />
        {[150, 190, 230, 270, 300].map((y) => (
          <path key={y} d={`M${420 + (320 - y) / 8} ${y} H${460 + (320 - y) / 13}`} />
        ))}
      </g>
    </svg>
  )
}
