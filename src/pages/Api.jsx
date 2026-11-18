import Page, { PageHero } from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Button } from '../components/ui/primitives.jsx'
import CodeBlock from '../components/ui/CodeBlock.jsx'
import { COMPANY } from '../data/company.js'

/**
 * Resources › API (Jake, Nov 18): "API Instructions for phenode.live" (September 2026), the PDF Jake sent, word for
 * word. Only the layout is the site's: a row per part (the PDF's two numbered steps, with the variables before them and
 * its "Need help?" line after), the PDF's inline code as chips, and each command in a block with a Copy button.
 * The help address is the PDF's (support@phenode.com), not COMPANY.supportEmail.
 */
const HELP_EMAIL = 'support@phenode.com'

const TOKEN = `ACCESS_TOKEN=$(jq -nc --arg email "$EMAIL" --arg password "$PASSWORD" \\
    '{email: $email, password: $password}' \\
  | curl --silent -X POST "$API_URL/auth/login" \\
    -H "Content-Type: application/json" --data @- \\
  | jq -r '.access_token')`
const REQUEST_URL = 'REQUEST_URL="$API_URL/devices/$DEVICE_ID/sensor-data?from=$FROM&to=$TO"'
const REQUEST = 'curl -X GET "$REQUEST_URL" -H "Authorization: Bearer $ACCESS_TOKEN"'

const link = 'text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink'

/** Inline code, as in the PDF, kept on one line; `long` (the request URL) may break, so it never pushes the page sideways. */
const C = ({ long = false, children }) => (
  <code className={`rounded-md border border-ink/10 bg-paper px-1.5 py-0.5 font-mono text-[0.86em] text-ink box-decoration-clone ${long ? '[overflow-wrap:anywhere]' : 'whitespace-nowrap'}`}>{children}</code>
)
const P = ({ className = 'mt-4', children }) => <p className={`text-[16px] leading-[1.75] text-ink/80 first:mt-0 ${className}`}>{children}</p>

/** One part: its label and heading on the left from 1024 px, the text and commands beside them. */
function Part({ label, title, children }) {
  return (
    <div className="mt-14 grid gap-6 border-t border-ink/10 pt-8 first:mt-0 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <Eyebrow>{label}</Eyebrow>
        <h2 className="display-sm mt-3 max-w-[16ch]">{title}</h2>
      </div>
      <div className="min-w-0 lg:col-span-8">{children}</div>
    </div>
  )
}

/** The Download / API drawing from the PheNode page's Data platform, on its night navy. */
const ART = (
  <div className="absolute inset-0 flex items-center justify-center bg-midnight bg-[radial-gradient(60%_70%_at_50%_45%,rgba(26,117,224,0.22),transparent_75%)]">
    <div className="journey-glow relative aspect-[4/3] h-[78%] max-w-[86%]">
      <img src={`${import.meta.env.BASE_URL}assets/journey/export.svg`} alt="" decoding="async" draggable="false" className="absolute inset-0 h-full w-full object-contain" />
    </div>
  </div>
)

export default function Api() {
  return (
    <Page title="API" description="API instructions for phenode.live: request an access token, then request sensor data for your PheNode and a time range.">
      <PageHero
        eyebrow="API"
        title="API Instructions for phenode.live"
        lede="To access our API, you need to configure a few variables and follow these steps."
        meta="September 2026"
        art={ART}
      />
      <Section theme="paper" padded={false} className="pb-28">
        <Container>
          <Part label="Before you start" title="Variables">
            <P>First, set the <C>API_URL</C> to <C>https://phenode.live/api</C></P>
            <P>
              You will need the <C>DEVICE_ID</C>, which is your PheNode’s MAC address. To find it, open the Fleet Overview,
              click the MAC button, and copy the ID exactly as shown. You will also need the <C>EMAIL</C> and <C>PASSWORD</C> you
              use to sign in at <a href={COMPANY.appUrl} className={link}>phenode.live</a>. If you sign in with Google, first set a
              password under Profile → Change Password. Also, specify the time range for your data request using
              the <C>FROM</C> (e.g., <C>2026-09-01T00:00:00Z</C>) and <C>TO</C> (e.g., <C>2026-09-01T23:59:59Z</C>) parameters, in UTC.
            </P>
          </Part>

          <Part label="Step 1" title="Request an Access Token">
            <P>
              Send an HTTP POST request to <C>API_URL/auth/login</C> with your <C>EMAIL</C> and <C>PASSWORD</C> as JSON. The
              response will include an <C>access_token</C> which you should store for further requests. Access tokens are
              short-lived, so if a request returns a 401 error, request a new one. For example, you can use curl and jq to get
              the access token:
            </P>
            <div className="mt-5"><CodeBlock code={TOKEN} name="the access token request" /></div>
          </Part>

          <Part label="Step 2" title="Request Sensor Data">
            <P>
              Use the access token to request sensor data for your specified device and time range. Send an HTTP GET
              request to the URL formed by <C long>{'API_URL/devices/DEVICE_ID/sensor-data?from=FROM&to=TO'}</C>, and
              include the <C>Authorization</C> header with the value <C>Bearer ACCESS_TOKEN</C>.
            </P>
            <P>For example:</P>
            <div className="mt-3"><CodeBlock code={REQUEST_URL} name="the request URL" /></div>
            <P className="mt-6">Finally,</P>
            <div className="mt-3"><CodeBlock code={REQUEST} name="the sensor data request" /></div>
            <P className="mt-6">
              The response is JSON with one row per time step, with times in UTC. Readings are averaged into steps that
              grow with the range: 1 minute for ranges up to 2 days, then hourly or longer.
            </P>
          </Part>

          <Part label="Support" title="Need help?">
            <P>Contact: <a href={`mailto:${HELP_EMAIL}`} className={link}>{HELP_EMAIL}</a></P>
            <div className="mt-6"><Button href={`mailto:${HELP_EMAIL}`} variant="primary-ink" icon="external">Email support</Button></div>
          </Part>
        </Container>
      </Section>
    </Page>
  )
}
