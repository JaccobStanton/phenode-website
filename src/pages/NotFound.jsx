import Page from '../components/layout/Page.jsx'
import { Container, Button } from '../components/ui/primitives.jsx'

export default function NotFound() {
  return (
    <Page title="Not found">
      <section className="theme-ink flex min-h-[70vh] items-center pt-24">
        <Container>
          <p className="eyebrow">404</p>
          <h1 className="display-lg mt-4 max-w-[14ch]">No measurement at this location.</h1>
          <p className="lede mt-4 max-w-[40ch]">The page you were looking for isn't here. The system is.</p>
          <div className="btn-row mt-8 flex flex-wrap gap-3"><Button to="/" variant="primary">Home</Button><Button to="/phenode" variant="ghost">Explore PheNode</Button></div>
        </Container>
      </section>
    </Page>
  )
}
