import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Layout, Toast, Space } from '../packages'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
  </StrictMode>,
)
