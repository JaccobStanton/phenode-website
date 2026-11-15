import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/geist-mono'
import './styles/index.css'
import App from './App.jsx'
import { installSmilPauser } from './lib/smil.js'
import { primeIntroHeader } from './lib/intro.js'

installSmilPauser()
primeIntroHeader() // before the first paint: the home intro starts with a reduced header

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
