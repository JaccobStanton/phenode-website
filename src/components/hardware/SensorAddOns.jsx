import { Img, AssetPlaceholder } from '../ui/primitives.jsx'
import { ADD_ON_SENSORS } from '../../data/specs.js'

const HOSTS = { base: 'PheNode base station', node: 'Wireless sensor node' }
// soil sensors first, then air and sun (Jake, Nov 17: "another row below the soil probes")
const ROWS = ['soil', 'air'].map((row) => ADD_ON_SENSORS.filter((s) => s.row === row))

/**
 * "Sensor add-ons": a card for each add-on sensor with what it measures, a few specs and what it connects to. On paper.
 * It was the "Configurable sensor packages" block of the home page's Hardware section; Jake moved it to the PheNode
 * page under the wireless node's specifications and renamed it (Nov 17).
 */
export default function SensorAddOns({ className = '' }) {
  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p className="eyebrow">Sensor add-ons</p>
          <h3 className="display-md mt-3 max-w-[16ch]">Connect only what sensors are needed.</h3>
        </div>
        <p className="max-w-[48ch] text-[15.5px] leading-relaxed text-ink/75 lg:col-span-6">For enhanced environmental insight, Agrela offers sensor add-on options for either the base station or the wireless sensor nodes.</p>
      </div>
      {ROWS.map((row, i) => (
        <ul key={row[0].row} className={`grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 ${i ? 'mt-4 md:grid-cols-2' : 'mt-10 md:grid-cols-3'}`}>
          {row.map((s) => <SensorCard key={s.id} sensor={s} />)}
        </ul>
      ))}
    </div>
  )
}

// From md up each card is a subgrid of its row's six tracks (image, name, measures, note, specs, connects), so the
// rule above the values and the "Connects to" list line up across the cards in a row, whatever the text above them
// (Jake, Nov 17). On phones the cards stack and keep their natural height.
function SensorCard({ sensor: s }) {
  return (
    <li className="flex flex-col bg-phenode-white p-6 md:row-span-6 md:grid md:grid-rows-subgrid md:gap-0">
      <div className="flex h-40 items-center justify-center">
        {s.image
          ? <Img name={`hardware/${s.image}`} widths={s.imageWidths} sizes="(min-width:768px) 30vw, 80vw" alt={s.name} className="max-h-32 w-auto max-w-full object-contain" />
          : <AssetPlaceholder label="Image to come" ratio="4 / 3" className="h-32 text-ink" />}
      </div>
      <h4 className="mt-4 text-[18px] font-semibold tracking-tight">{s.name}</h4>
      <p className="mt-1 font-mono text-[11px] tracking-[0.1em] uppercase text-stone-2">{s.measures.join(' · ')}</p>
      <p className="mt-3 text-[14px] leading-relaxed text-ink/75">{s.note}</p>
      <dl className="mt-4 grid content-start gap-1 border-t border-ink/10 pt-3 text-[12.5px]">
        {s.specs.map((sp) => (
          <div key={sp.name} className="grid grid-cols-[1fr_auto] gap-3"><dt className="text-stone-2">{sp.name}</dt><dd className="text-right font-mono text-[11.5px] text-ink/85">{sp.range}</dd></div>
        ))}
      </dl>
      <div className="mt-auto pt-5 md:mt-0">
        <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-stone-2">Connects to</p>
        <ul className="mt-2 flex flex-col gap-1 text-[13.5px] text-ink/85" aria-label={`${s.name} connects to`}>
          {s.connects.map((h) => <li key={h} className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-data" aria-hidden="true" />{HOSTS[h]}</li>)}
        </ul>
      </div>
    </li>
  )
}
