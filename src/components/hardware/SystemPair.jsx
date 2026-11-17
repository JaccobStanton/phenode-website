import { Img } from '../ui/primitives.jsx'
import { BASE_STATION_WIDTHS } from '../../data/baseStationParts.js'

/**
 * The 2026 system graphic: the v4 base station render with the 2026 wireless node standing at its lower left, on a
 * soft floor shadow. Same composition as the PheNode page hero (sections/phenode/OverviewHero.jsx), without its
 * scroll animation. Replaced the old "system-composite" image (Jake, Nov 16). Size it with `className` (it keeps
 * the render's 2400×1625 ratio; the node reaches a little past the bottom-left corner).
 */
export default function SystemPair({
  className = '',
  loading = 'lazy',
  baseSizes = '(min-width:1024px) 70vw, 96vw',
  nodeSizes = '(min-width:1024px) 16vw, 26vw',
}) {
  return (
    <div className={`relative aspect-[2400/1625] ${className}`}>
      <div aria-hidden="true" className="absolute inset-x-[8%] bottom-[1%] h-[9%] rounded-[50%] bg-black/80 blur-2xl" />
      <Img
        name="hardware/base-station-v4" widths={BASE_STATION_WIDTHS} sizes={baseSizes} loading={loading}
        alt="PheNode base station: rain gauge, solar panel, wind sensor, radiation shield, control box and imager on its aluminum frame."
        className="absolute inset-0 h-full w-full object-contain"
      />
      <Img
        name="hardware/wireless-node-2026" widths={[320, 600, 880]} sizes={nodeSizes} loading={loading}
        alt="Agrela wireless sensor node."
        className="absolute bottom-[-5%] left-[-3%] w-[27%] md:w-[22%]"
      />
    </div>
  )
}
