import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Yuwan, Toast } from '../packages'

const App = () => {
  const handleShowToast = () => {
    Toast.show({
      children: <div>hellow world</div>,
    })
  }
  return (
    <button onClick={handleShowToast}>点击</button>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Yuwan>
      <App />
    </Yuwan>
  </StrictMode>,
)
