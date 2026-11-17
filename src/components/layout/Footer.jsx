import { Link } from 'react-router-dom'
import { FOOTER } from '../../data/navigation.js'
import { COMPANY } from '../../data/company.js'
import { PheNodeLogo, AgrelaLogo } from '../ui/Logos.jsx'

export default function Footer() {
  return (
    <footer className="theme-ink border-t border-white/10">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="flex flex-col gap-6">
            <PheNodeLogo height={22} />
            <p className="max-w-[34ch] text-[15px] text-stone">A flexible, scalable environmental monitoring platform, built around the question you need to answer.</p>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${COMPANY.supportEmail}`} className="font-mono text-[12px] tracking-[0.1em] text-stone hover:text-paper">{COMPANY.supportEmail}</a>
            </div>
          </div>
          {FOOTER.map((col) => (
            <div key={col.heading}>
              <h2 className="eyebrow mb-4">{col.heading}</h2>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(([label, to]) => (
                  <li key={to + label}><Link to={to} className="text-[14.5px] text-paper/75 transition-colors hover:text-paper">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <AgrelaLogo height={26} />
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-stone">St. Louis, Missouri</span>
          </div>
          <p className="font-mono text-[11px] tracking-[0.08em] text-stone">© {COMPANY.founded}–{new Date().getFullYear()} {COMPANY.name}. PheNode® is a registered trademark of Agrela Ecosystems.</p>
        </div>
      </div>
    </footer>
  )
}
