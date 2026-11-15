import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight } from 'lucide-react'

/** Mono eyebrow with an index — "01 — Environment". */
export function Eyebrow({ index, children, className = '' }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      {index && <span>{index}</span>}
      {index && <span className="h-px w-6 bg-current opacity-40" aria-hidden="true" />}
      <span>{children}</span>
    </p>
  )
}

/** Section wrapper with theme + vertical rhythm. */
export function Section({ id, theme = 'ink', className = '', children, padded = true, as: Tag = 'section', ...rest }) {
  return (
    <Tag id={id} className={`relative theme-${theme} ${padded ? 'section-y' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export function Container({ className = '', children }) {
  return <div className={`container-x ${className}`}>{children}</div>
}

const variants = {
  primary: 'btn-primary', 'primary-ink': 'btn-primary-ink', ghost: 'btn-ghost', 'ghost-ink': 'btn-ghost-ink', signal: 'btn-signal',
}

/** Button that renders a Link for internal paths, an <a> for external, or a <button>. */
export function Button({ to, href, variant = 'primary', icon = 'arrow', children, className = '', ...rest }) {
  const cls = `${variants[variant] || variants.primary} ${className}`
  const Icon = icon === 'external' ? ArrowUpRight : icon === 'arrow' ? ArrowRight : null
  const inner = (<>{children}{Icon && <Icon size={16} strokeWidth={2} aria-hidden="true" />}</>)
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  if (href) return <a href={href} className={cls} target="_blank" rel="noreferrer" {...rest}>{inner}</a>
  return <button type="button" className={cls} {...rest}>{inner}</button>
}

/** Two CTAs at equal width (the longer label sets both); stacked on phones. Pass layout classes (margins, reveal) via className. */
export function ButtonPair({ children, className = '', style }) {
  return <div className={`grid w-fit grid-cols-1 gap-3 sm:grid-cols-2 ${className}`} style={style}>{children}</div>
}

/** Responsive WebP image from /public/assets with width variants. */
export function Img({ name, widths, alt, sizes = '(min-width: 1024px) 50vw, 100vw', className = '', loading = 'lazy', style, ...rest }) {
  const base = `${import.meta.env.BASE_URL}assets/${name}`
  const srcSet = widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ')
  const largest = Math.max(...widths)
  return <img src={`${base}-${largest}.webp`} srcSet={srcSet} sizes={sizes} alt={alt} loading={loading} decoding="async" className={className} style={style} {...rest} />
}

/** Oversized number + label. */
export function Stat({ value, label, note, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="stat-xl">{value}</div>
      <div className="font-mono text-[12px] tracking-[0.16em] uppercase opacity-80">{label}</div>
      {note && <div className="text-sm opacity-60 max-w-[26ch]">{note}</div>}
    </div>
  )
}

/** Small "Demo data" / "Illustrative" tag. */
export function Tag({ children, tone = 'muted', className = '' }) {
  const tones = { muted: 'border-current/20 opacity-85', signal: 'border-signal text-signal', data: 'border-data text-data' }
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase ${tones[tone]} ${className}`}>{children}</span>
}

/** Hairline rule. */
export function Rule({ className = '' }) { return <hr className={`border-t hairline ${className}`} /> }

/** Placeholder frame for assets awaiting delivery. */
export function AssetPlaceholder({ label, ratio = '16 / 9', className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-dashed border-current/25 ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={`Placeholder: ${label}`}>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgba(127,127,127,0.08)_14px_15px)]" />
      <div className="absolute inset-x-4 bottom-4 font-mono text-[11px] tracking-[0.14em] uppercase opacity-70">{label}</div>
    </div>
  )
}
