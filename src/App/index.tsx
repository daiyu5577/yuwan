import { useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx.min.js'
import 'prismjs/themes/prism.min.css'
import Space, { name as SpaceName } from '../Space'
import Toast, { name as ToastName } from '../Toast'
import LuckDraw, { name as LuckDrawName } from '../LuckDraw'
import styles from './index.module.less'

const hooks = [
  {
    name: LuckDrawName,
    component: LuckDraw,
  },
]

const components = [
  {
    name: SpaceName,
    component: Space,
  },
  {
    name: ToastName,
    component: Toast,
  },
]

Prism.manual = true

const App = () => {

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <div className={styles.app}>
      <h3>Yuwan Components</h3>
      <div className='title' id='install'>install</div>
      <div className='box'>
        <code className="language-js">pnpm add @daiyu-5577/yuwan-react</code>
      </div>
      <div className='title' id='usage'>usage</div>
      <pre className='box'>
        <code className="language-jsx">
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

      <h3>Hooks</h3>
      {
        hooks.map((item) => {
          return (
            <div key={item.name}>
              <div className='title' id={item.name}>{item.name}</div>
              <pre className='box'>
                <item.component />
              </pre>
            </div>
          )
        })
      }


      <h3>Components</h3>
      {
        components.map((item) => {
          return (
            <div key={item.name}>
              <div className='title' id={item.name}>{item.name}</div>
              <pre className='box'>
                <item.component />
              </pre>
            </div>
          )
        })
      }

    </div>
  )
}

export default App
