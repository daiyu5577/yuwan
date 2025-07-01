import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout, Toast, Space } from '../packages'

const App = () => {
  const handleShowMessage = () => {
    Toast.message({
      children: <div>hellow world</div>,
    })
  }

  const handleShowLoading = () => {
    Toast.loading({
      // duration: Infinity,
      duration: 1000,
      isDisabledClick: true
    })
  }
  return (
    <div>
      <Space colGap='10px' rowGap='10px'>
        <button onClick={handleShowMessage}>message</button>
        <button onClick={handleShowLoading}>loading</button>
      </Space>
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
