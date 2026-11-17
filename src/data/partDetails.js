/**
 * The detail view for each base-station component in the home hero (components/hardware/PartDetail.jsx).
 * Every figure comes from the Summer 2025 Buyer's Guide / agrelaeco.com via specs.js and baseStationParts.js:
 * don't add numbers here that aren't published.
 *
 * Spec rows: { name, value, note?, lead? } — `value` is the figure (shown in the data colour), `note` the second,
 * quieter line (usually the accuracy), and `lead` a quiet word before the value when that figure needs naming.
 */
import { BASE_STATION, ADD_ON_SENSORS } from './specs.js'

/**
 * A row from the base station's published sensor specs: range on the first line, accuracy underneath. When only the
 * accuracy is published (gust), the accuracy figure is the value and "Accuracy" stays a quiet lead-in word.
 */
function sensorRow(name, label = name) {
  const s = BASE_STATION.sensorSpecs.find((x) => x.name === name)
  const range = s.range !== '—' ? s.range : null
  const accuracy = s.accuracy !== '—' ? s.accuracy : null
  return range ? { name: label, value: range, note: accuracy && `Accuracy ${accuracy}` } : { name: label, lead: 'Accuracy', value: accuracy }
}

const SOIL = ADD_ON_SENSORS.find((s) => s.id === 'soil-standard')

export const PART_DETAILS = {
  rain: {
    kicker: 'Precipitation',
    lede: 'Tipping-bucket rainfall with an Agrela-designed funnel, measured right at the station.',
    body: 'In the software it becomes rainfall and storms for every PheNode, tracked against local references, and each gauge is checked every month against the official gauges nearby.',
    specs: [
      { name: 'Rainfall', value: 'Tipping bucket, Agrela-designed funnel', note: 'Accuracy ±3 %' },
    ],
  },
  solar: {
    kicker: 'Power',
    lede: 'A 10 W / 6 V solar panel runs the station off-grid.',
    body: 'USB-C is there as an alternative power option, and the data leaves the site over cellular or Wi-Fi, with satellite backup.',
    specs: [
      { name: 'Solar panel', value: '10 W / 6 V' },
      { name: 'Alternative power', value: 'USB-C' },
      { name: 'Connectivity', value: 'Cellular or Wi-Fi', note: 'With satellite backup' },
    ],
  },
  wind: {
    kicker: 'Wind',
    lede: 'Speed, direction and gust from one sensor at the top of the frame.',
    body: 'Wind shapes drying, spray drift and fire weather, so it is measured where your site is, not taken from a distant station.',
    specs: [sensorRow('Wind speed', 'Speed'), sensorRow('Wind direction', 'Direction'), sensorRow('Wind gust', 'Gust')],
  },
  air: {
    kicker: 'Ambient air',
    lede: 'Temperature, humidity, air pressure and vapor pressure, read inside a louvered radiation shield.',
    body: 'The shield keeps direct sun off the sensor, so the readings describe the air around the station rather than a warm housing.',
    photo: { name: 'hardware/sensor-atmos-14', widths: [300, 590], alt: 'The ambient air sensor (ATMOS 14) in its louvered radiation shield', caption: 'ATMOS 14 ambient air sensor, in its radiation shield' },
    specs: [sensorRow('Temperature'), sensorRow('Humidity'), sensorRow('Air pressure')],
  },
  control: {
    kicker: 'Control',
    lede: 'The station’s controller: sensor connections, power management and the link to the cloud.',
    body: 'SDI-12 and RS-485 connectors take custom and third-party sensors, data goes out over cellular or Wi-Fi with satellite backup, and settings can be changed remotely without a site visit.',
    specs: [
      { name: 'Sensor connections', value: 'SDI-12 and RS-485', note: 'For custom and third-party sensors' },
      { name: 'Connectivity', value: 'Cellular or Wi-Fi', note: 'With satellite backup' },
      { name: 'Remote control', value: 'Adjust settings without a site visit' },
    ],
  },
  imager: {
    kicker: 'Imaging',
    lede: 'A 5 MP RGB camera, the Agrela Standard Imager, on an adjustable mount.',
    body: 'It sends 1 to 4 images a day over cellular, so you can see conditions at the site next to what the sensors are measuring.',
    specs: [
      { name: 'Camera', value: '5 MP RGB' },
      { name: 'Images', value: '1–4 per day', note: 'Over cellular' },
      { name: 'Mount', value: 'Adjustable' },
    ],
  },
  soil: {
    kicker: 'Soil',
    lede: 'Soil moisture, temperature and EC from the standard soil sensor.',
    body: `${SOIL.note} Water potential and multi-depth profile probes are available too.`,
    photo: { name: 'hardware/sensor-soil-standard', widths: [400, 700], alt: 'The standard soil sensor', caption: 'Standard soil sensor' },
    specs: SOIL.specs.map((s) => ({ name: s.name, value: s.range, note: `Accuracy ${s.accuracy}` })),
  },
  frame: {
    kicker: 'Structure',
    lede: 'Durable, recyclable aluminum holds the whole sensor suite together.',
    body: 'It mounts to U-posts, poles and tripods from 1.5 to 2.5 inches across, or to the optional 3-section aluminum tower with ground stakes and guy wires.',
    photo: { name: 'hardware/base-station-pole-2026', widths: [460, 910], alt: 'PheNode base station on the 3-section aluminum tower and tripod', caption: 'Tower configuration' },
    specs: [
      { name: 'Material', value: 'Aluminum', note: 'Durable and recyclable' },
      { name: 'Mounts', value: 'U-posts, poles and tripods', note: '1.5–2.5″ diameter' },
      { name: 'Tower', value: 'Optional 3-section aluminum tower', note: 'Ground stakes and guy wires' },
    ],
  },
}
