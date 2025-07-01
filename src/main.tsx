import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout, Toast } from '../packages'

const App = () => {
  const handleShowMessage = () => {
    Toast.message({
      children: <div>hellow world</div>,
    })
  }

  const handleShowLoading = () => {
    Toast.loading({
      duration: Infinity,
      isDisabledClick: true
    })
  }
  return (
    <div>
      <button onClick={handleShowMessage}>message</button>
      <button onClick={handleShowLoading}>loading</button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
  </StrictMode>,
)
