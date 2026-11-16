import { useParams, Navigate } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import { Container, Section, Tag } from '../components/ui/primitives.jsx'
import { TERMS_BLOCKS, TERMS_UPDATED } from '../data/legalTerms.jsx'

const link = 'text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink'

/**
 * Legal documents. Each is a list of blocks: ['h', heading], ['p', paragraph], ['ul', [items]],
 * ['p1'] / ['p2'] indented items. Both are Agrela's published documents, copied word for word (Jake, Nov 15, 2026):
 * - The privacy policy is from https://www.agrelaeco.com/privacy-policy, with its headings, list and links.
 *   Only the link to the Terms of Service is repaired: on agrelaeco.com its address ends in ")", which doesn't
 *   open the page. The text reads the same.
 * - The terms are from https://www.agrelaeco.com/terms-of-service (data/legalTerms.jsx).
 */
const DOCS = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated April, 2023',
    blocks: [
      ['p', 'Agrela Ecosystems, Inc. (“Agrela”) has created this privacy statement in order to demonstrate our firm commitment to privacy. Due to the potentially sensitive nature of the information we collect from our users, we believe it is important to satisfy strict privacy requirements. The following discloses our information gathering and dissemination practices for this Web site:'],
      ['h', 'Collected Information:'],
      ['p', 'The following section describes the information we collect from you and indicates the primary purposes why we collect each type of information from you. As described below in more detail, we use your IP address to help diagnose problems with our server, and to administer our Web site. Your IP address is or may be used to help identify you, to track activity within our site and to gather broad demographic information. Our Web server will collect IP information. Our site uses cookies to keep track of your session ID. We may use cookies to deliver content specific to your interests.'],
      ['h', 'Agrela may also use the information we collect from you to:'],
      ['ul', [
        'optimize our Web site so that it is more beneficial to users like yourself and to us;',
        'perform services on behalf of the business, including maintaining or servicing accounts, providing customer service, processing or fulfilling orders and transactions, verifying customer information, processing payments, providing financing, providing analytic services, providing storage, or providing similar services on behalf of the business or service provider; and/or',
        'comply with our legal and regulatory obligations.',
      ]],
      ['p', 'This site may contain links to other sites. Agrela is not responsible for the privacy practices or the content of such websites.'],
      ['h', 'Security:'],
      ['p', 'This Web site has security measures in place to protect the loss, misuse and alteration of the information under our control. All user data is stored on our servers.'],
      ['p', 'The user may request, via email or telephone, additional information about Agrela’s security practices. The requested security information will be made available to the user via email, fax or postal mail, in our discretion.'],
      ['h', 'Amendments:'],
      ['p', 'From time-to-time, we may amend our information practices as described in this privacy statement.'],
      ['h', 'Contacting the Web Site:'],
      ['p', <>If you have any questions about this privacy statement, the practices of this site, or your dealings with this Web site, you can contact: <a href="mailto:info@agrelaeco.com" className={link}>info@agrelaeco.com</a>, or call (314) 485-9850.</>],
      ['p', <>For information regarding user data and privacy related to the use of the PheNode or Agrela’s Services, see Agrela’s Terms of Service (<a href="https://www.agrelaeco.com/terms-of-service" target="_blank" rel="noreferrer" className={link}>https://www.agrelaeco.com/terms-of-service</a>), which are adopted and incorporated herein. Any capitalized terms used in this Privacy Policy not otherwise defined herein shall have their meaning set forth in the Terms of Service.</>],
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: TERMS_UPDATED,
    blocks: TERMS_BLOCKS,
  },
}

function Block({ kind, content }) {
  if (kind === 'h') return <h2 className="mt-10 text-[20px] font-semibold tracking-tight text-ink first:mt-0">{content}</h2>
  if (kind === 'ul') return <ul className="mt-3 flex list-disc flex-col gap-2 pl-6 text-[15.5px] leading-relaxed text-ink/80 marker:text-ink/40">{content.map((li) => <li key={li}>{li}</li>)}</ul>
  // lettered (a.) and roman-numeral (i.) items sit under their clause
  if (kind === 'p1') return <p className="mt-2 pl-6 text-[15.5px] leading-relaxed text-ink/80 sm:pl-8">{content}</p>
  if (kind === 'p2') return <p className="mt-2 pl-12 text-[15.5px] leading-relaxed text-ink/80 sm:pl-16">{content}</p>
  return <p className="mt-3 text-[15.5px] leading-relaxed text-ink/80 first:mt-0">{content}</p>
}

export default function Legal() {
  const { doc } = useParams()
  const d = DOCS[doc]
  if (!d) return <Navigate to="/" replace />
  return (
    <Page title={d.title}>
      <section className="theme-paper pt-28 pb-6 md:pt-40">
        <Container>
          <p className="eyebrow">Legal</p>
          <h1 className="display-lg mt-4">{d.title}</h1>
          <div className="mt-4 flex items-center gap-3">
            {d.placeholder && <Tag tone="signal">Placeholder</Tag>}
            <span className="font-mono text-[11px] tracking-[0.1em] text-stone-2">{d.updated}</span>
          </div>
        </Container>
      </section>
      <Section theme="paper" className="!pt-8">
        <Container>
          <div className="max-w-[72ch] border-t border-ink/10 pt-8">
            {d.blocks.map(([kind, content], i) => <Block key={i} kind={kind} content={content} />)}
            {d.placeholder && <p className="mt-10 text-[13px] text-stone-2">Replace this placeholder with Agrela’s reviewed {d.title.toLowerCase()}.</p>}
          </div>
        </Container>
      </Section>
    </Page>
  )
}
