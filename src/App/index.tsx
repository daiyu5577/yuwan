import { Layout, Toast, Space } from '../../packages'
import Prism from 'prismjs'
import 'prismjs/themes/prism.min.css'
import styles from './index.module.less'
import { useEffect } from 'react'

Prism.manual = true

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

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <div className={styles.app}>
      <h3>Yuwan Components</h3>
      <div className='title'>install</div>
      <div className='desc'>
        <code className="language-js">pnpm add @daiyu-5577/yuwan-react</code>
      </div>
      <div className='title'>usage</div>
      <pre className='desc'>
        <code className="language-js">
          {`import { Layout as Yuwan, Toast } from 'yuwan-react'
import '@daiyu-5577/yuwan-react/index.css'

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
    <Yuwan>
      <button onClick={handleShowMessage}>click message</button>
      <button onClick={handleShowLoading}>click loading</button>
    </Yuwan>
  )
}`}
        </code>
      </pre>

      <h3>Components</h3>

      {/* Space */}
      <div className='title'>Space</div>
      <div className='desc'>
        <Space>
          {
            new Array(3).fill(0).map((_v, i) => {
              return <button className='btn atouch' key={i}>buttom</button>
            })
          }
        </Space>
      </div>

      {/* Toast */}
      <div className='title'>Toast</div>
      <div className='desc'>
        <Space colGap='10px' rowGap='10px'>
          <button className='btn atouch' onClick={handleShowMessage}>message</button>
          <button className='btn atouch' onClick={handleShowLoading}>loading</button>
        </Space>
      </div>
    </div>
  )
}

export default App
