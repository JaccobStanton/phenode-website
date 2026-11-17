import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useReveal } from '../../lib/motion.js'

const LAYERS = [
  { id: 'sensors', name: 'Sensors', tone: 'signal', summary: 'Onboard suite + add-ons; SDI-12 / RS-485 for third-party', detail: ['Base station: temperature, humidity, pressure, vapor pressure, rainfall, wind (speed / direction / gust), solar radiation, 5 MP imager', 'Wireless node: temperature, humidity, pressure, air quality, lux', 'Add-ons: standard soil sensor (VWC / T / EC), water potential, 4-depth profile probe', 'Third-party: SDI-12 and RS-485 connectors on the control box'] },
  { id: 'node', name: 'Wireless sensor node', tone: 'signal', summary: 'LoRaWAN · solar + rechargeable battery · 2 agnostic sensor ports', detail: ['Hourly transmission to the nearest PheNode', 'Up to 1 km line of sight', 'USB-C recharge for up to a growing season without sunlight', 'Black anodized aluminum mounting bracket'] },
  { id: 'network', name: 'Wireless network', tone: 'signal', summary: 'Low-power, long-range links; hundreds of acres per PheNode', detail: ['A single PheNode can command a fleet of wireless sensors', 'Indoor and outdoor operation (growth chambers, greenhouses, fields)'] },
  { id: 'base', name: 'PheNode base station', tone: 'paper', summary: 'Control box: controller · sensor connections · power · cellular / Wi-Fi / satellite', detail: ['Solar (10 W / 6 V) and USB-C power', 'Cellular or Wi-Fi uplink, with satellite backup', 'Remote control from the software', 'Aluminum sensor frame; post, pole, tripod or 3-section tower mounting'] },
  { id: 'backend', name: 'Backend', tone: 'data', summary: 'Ingest API · dockerized · portable for advanced users', detail: ['Centralized collection for the whole fleet', 'Dockerized backend available where self-managed data flow is required', 'Cellular and cloud infrastructure fees covered by the service subscription'] },
  { id: 'storage', name: 'Storage / processing', tone: 'data', summary: 'Time-series store · cleaning preferences · normalized output', detail: ['Consistent columns across devices, nodes and sites', 'Cleaning preferences applied on CSV export', 'Data kept safe, even if a subscription expires'] },
  { id: 'software', name: 'PheNode software', tone: 'data', summary: 'Fleet · wireless network · visualization · imaging · downloads · remote control', detail: ['Browser-based; sub-accounts for employees, partners and demonstrations', 'Time-series visualization', 'Image viewing (1–4 per day per PheNode)'] },
  { id: 'external', name: 'API / downloads / external tools', tone: 'data', summary: 'CSV downloads · API · your own pipelines', detail: ['Structured data access for notebooks, dashboards and models', 'Downloads with your cleaning preferences', 'Custom integrations scoped with Agrela'] },
]

const tone = { signal: 'text-signal border-signal/40', paper: 'text-current border-current/40', data: 'text-data border-data/40' }

/** Clean vertical architecture stack with an optional technical layer. */
export default function ArchitectureDiagram({ className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useReveal()
  return (
    <div ref={ref} className={className}>
      <ol className="relative flex flex-col" aria-label="PheNode system architecture">
        {LAYERS.map((l, i) => (
          <li key={l.id} className="reveal relative grid grid-cols-[48px_1fr] gap-4 md:grid-cols-[64px_260px_1fr] md:gap-6">
            <div className="relative flex flex-col items-center">
              <span className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-[var(--surface)] font-mono text-[10px] ${tone[l.tone]}`}>{String(i + 1).padStart(2, '0')}</span>
              {i < LAYERS.length - 1 && <span className="w-px flex-1 bg-current opacity-20" aria-hidden="true" />}
              {i < LAYERS.length - 1 && <span className="absolute top-8 h-[calc(100%-2rem)] w-px" aria-hidden="true"><span className="block h-2 w-2 -translate-x-1/2 rounded-full bg-current opacity-0" /></span>}
            </div>
            <div className="pb-7">
              <p className="text-[17px] font-semibold tracking-tight">{l.name}</p>
              <p className="mt-0.5 text-[13.5px] opacity-70 md:hidden">{l.summary}</p>
            </div>
            <div className="hidden pb-7 md:block">
              <p className="text-[14.5px] opacity-80">{l.summary}</p>
              {open && <ul className="mt-2 flex flex-col gap-1 text-[13.5px] opacity-70">{l.detail.map((d) => <li key={d} className="flex gap-2"><span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-current" />{d}</li>)}</ul>}
            </div>
            {open && (
              <ul className="col-span-2 -mt-4 mb-6 flex flex-col gap-1 pl-16 text-[13.5px] opacity-70 md:hidden">{l.detail.map((d) => <li key={d} className="flex gap-2"><span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-current" />{d}</li>)}</ul>
            )}
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="btn-ghost mt-2 !px-4 !py-2 text-[14px]">
        {open ? 'Hide technical architecture' : 'View technical architecture'} <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  )
}
