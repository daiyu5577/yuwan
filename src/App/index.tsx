import { Layout, Toast, Space } from '../../packages'
import styles from './index.module.less'

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
    <div className={styles.app}>
      <h3>Yuwan Components</h3>
      <div className='title'>install</div>
      <div className='desc'>pnpm add @daiyu-5577/yuwan-react</div>
      <div className='title'>usage</div>
      <pre className='desc'>
        {`import { Layout as Yuwan, Toast } from 'yuwan-react'\n`}
        {`import '@daiyu-5577/yuwan-react/index.css'\n\n`}
        {`const App = () => { \n return ( \n  <Yuwan>...</Yuwan> \n  ) \n }`}
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
