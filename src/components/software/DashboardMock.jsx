import { useMemo } from 'react'
import { Home, Wifi, Download, Settings, Camera, Activity, Map as MapIcon, Layers } from 'lucide-react'
import MiniChart from '../viz/MiniChart.jsx'
import { diurnalSeries, soilMoistureSeries, rainfallSeries } from '../../lib/demoData.js'

/**
 * Illustrative recreation of the PheNode dashboard (midnight-blue theme). Only features the real software has:
 * fleet view, wireless sensor network, measurements, time-series charts, imaging, downloads, settings.
 * Labelled "Illustrative" wherever it is shown; swap for real screenshots via docs/asset-manifest.md.
 */
const TILES = [
  { k: 'Temperature', v: '66.61 °F', s: 'Operational' },
  { k: 'Humidity', v: '44.30 %', s: 'Operational' },
  { k: 'Air pressure', v: '99.29 kPa', s: 'Operational' },
  { k: 'Hourly rainfall', v: '0.25"', s: 'Operational' },
  { k: 'Soil moisture', v: '28.05 %', s: 'Operational' },
  { k: 'Wind speed', v: '12.34 mph', s: 'NW · gust 21.13' },
]

export default function DashboardMock({ variant = 'desktop', className = '', compact = false }) {
  const series = useMemo(() => ({
    temp: [{ name: 'Air temp', data: diurnalSeries({ seed: 31, base: 19, amp: 6, days: 3 }), color: '#48F7F5' }],
    rh: [{ name: 'RH', data: diurnalSeries({ seed: 32, base: 55, amp: 18, phase: 4, days: 3 }), color: '#7FB8FF' }],
    soil: [{ name: 'Soil VWC', data: soilMoistureSeries({ seed: 33, days: 3, rainAt: [30] }), color: '#48F7F5' }],
    rain: [{ name: 'Rain', data: rainfallSeries({ seed: 34, days: 3, events: [[30, 6]] }), color: '#7FB8FF' }],
  }), [])
  const phone = variant === 'phone'
  const tablet = variant === 'tablet'
  const ticks = ['Mon', 'Tue', 'Wed']
  return (
    <div className={`device-screen flex h-full w-full flex-col overflow-hidden text-[#cfe3ff] ${className}`} style={{ fontFamily: 'var(--font-sans)', background: 'linear-gradient(180deg,#071432 0%,#061127 60%,#050d1f 100%)' }} aria-label="Illustrative PheNode dashboard" role="img">
      {/* top bar */}
      <div className={`flex items-center justify-between border-b border-[#1b3a6b] ${phone ? 'px-3 py-2' : 'px-4 py-2.5'}`}>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-4 rounded-[2px] bg-[#1A75E0]" /><span className={`font-semibold tracking-tight text-[#e8f2ff] ${phone ? 'text-[11px]' : 'text-[13px]'}`}>PheNode</span>
          {!phone && <span className="ml-3 rounded border border-[#1b3a6b] px-2 py-0.5 text-[10px] text-[#8fb3e6]">PheNode_0001 ▾</span>}
        </div>
        <div className="flex items-center gap-2 text-[#8fb3e6]">
          {[Home, Activity, Wifi, Download, Settings].slice(0, phone ? 3 : 5).map((I, i) => <I key={i} size={phone ? 11 : 13} strokeWidth={1.8} className={i === 1 ? 'text-[#48F7F5]' : ''} />)}
        </div>
      </div>
      <div className={`flex items-center justify-between ${phone ? 'px-3 pt-2' : 'px-4 pt-3'}`}>
        <p className={`font-semibold text-[#48F7F5] ${phone ? 'text-[10px]' : 'text-[12px]'}`}>PheNode System Status <span className="font-normal text-[#8fb3e6]">// last measurement 12:34 PM</span></p>
        {!phone && <p className="text-[10px] text-[#8fb3e6]">Cellular ▮▮▮▯ · Wi-Fi ▮▮▯▯</p>}
      </div>
      {/* status row */}
      <div className={`grid gap-2 ${phone ? 'grid-cols-2 px-3 pt-2' : tablet ? 'grid-cols-3 px-4 pt-3' : 'grid-cols-[1fr_2fr_1fr] px-4 pt-3'}`}>
        <div className="flex h-[84px] flex-col justify-center rounded border border-[#1b3a6b] bg-[#0a1d45]/60 p-2.5">
          <p className="text-[18px] font-semibold text-[#48F7F5]">9</p><p className="text-[9px] uppercase tracking-wider text-[#8fb3e6]">Wireless sensors connected</p>
        </div>
        {!phone && (
          <div className="relative flex h-[84px] items-center justify-center overflow-hidden rounded border border-[#1b3a6b] bg-[#0a1d45]/40 p-2">
            <svg viewBox="0 0 200 70" className="h-full w-auto" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <g fill="none" stroke="#48F7F5" strokeOpacity="0.8" strokeWidth="1.2"><path d="M20 20 h160 l-18 36 h-124 z" /><rect x="80" y="8" width="40" height="12" rx="2" /><path d="M100 56 v10" /><circle cx="172" cy="12" r="4" /></g>
              <g fill="#48F7F5" opacity="0.6">{[40, 60, 80].map((x) => <rect key={x} x={x} y="30" width="8" height="6" rx="1" />)}</g>
              <text x="100" y="42" textAnchor="middle" fill="#48F7F5" fontSize="8" fontFamily="var(--font-mono)">PheNode</text>
            </svg>
          </div>
        )}
        <div className="flex h-[84px] flex-col justify-center rounded border border-[#1b3a6b] bg-[#0a1d45]/60 p-2.5">
          <div className="flex items-center gap-1.5 text-[#48F7F5]"><Camera size={12} /><span className="text-[10px] font-medium">See images</span></div>
          <p className="mt-1 text-[9px] uppercase tracking-wider text-[#8fb3e6]">Battery 94.26 % · GPS fixed</p>
        </div>
      </div>
      {/* measurement tiles */}
      {!compact && (
        <div className={`grid gap-2 ${phone ? 'grid-cols-2 px-3 pt-2' : tablet ? 'grid-cols-3 px-4 pt-3' : 'grid-cols-6 px-4 pt-3'}`}>
          {TILES.slice(0, phone ? 4 : 6).map((t) => (
            <div key={t.k} className="rounded border border-[#1b3a6b] bg-[#0a1d45]/50 p-2">
              <p className="text-[9px] text-[#8fb3e6]">{t.k}</p><p className="text-[12px] font-semibold text-[#e8f2ff]">{t.v}</p><p className="text-[8px] text-[#48F7F5]/80">{t.s}</p>
            </div>
          ))}
        </div>
      )}
      {/* charts */}
      <div className={`grid flex-1 gap-2 ${phone ? 'grid-cols-1 p-3' : tablet ? 'grid-cols-2 p-4' : 'grid-cols-4 p-4'}`}>
        {[['Air temperature', series.temp, '°'], ['Relative humidity', series.rh, '%'], ['Soil moisture', series.soil, '%'], ['Rainfall', series.rain, '"']].slice(0, phone ? 2 : 4).map(([k, s, u]) => (
          <div key={k} className="min-w-0 rounded border border-[#1b3a6b] bg-[#0a1d45]/40 p-2 text-[#8fb3e6]">
            <p className="mb-1 text-[9px] uppercase tracking-wider">{k}</p>
            <MiniChart series={s} height={phone ? 70 : 90} grid={2} unit={u} ticks={ticks} />
          </div>
        ))}
      </div>
      {!phone && (
        <div className="flex items-center justify-between border-t border-[#1b3a6b] px-4 py-1.5 text-[9px] text-[#8fb3e6]">
          <span className="flex items-center gap-3"><span className="flex items-center gap-1"><MapIcon size={10} /> Map</span><span className="flex items-center gap-1"><Layers size={10} /> Wireless network</span><span className="flex items-center gap-1"><Download size={10} /> Download</span></span>
          <span>Illustrative · demo data</span>
        </div>
      )}
    </div>
  )
}
