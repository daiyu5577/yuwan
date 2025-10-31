import React, { type FC } from 'react'
import Space from '../../packages/Space'
import Toast from '../../packages/Toast'

const Component: FC = () => {

  return (
    <div>
      <h3>example</h3>
      <Space align='center' colGap='10px' rowGap='10px'>
        <button
          className='btn atouch'
          onClick={() => {
            Toast.message({
              children: <div>hellow world</div>,
            })
          }}>
          message
        </button>
        <button
          className='btn atouch'
          onClick={() => {
            Toast.loading({
              duration: 1000,
              isMackClick: true
            })
          }}>
          loading
        </button>
        <button
          className='btn atouch'
          onClick={() => {
            const res = Toast.message({
              duration: Infinity,
              isShowMask: true,
              isMackClick: true,
              children: <div onClick={() => res?.close()}>Click me to close!</div>,
            })
          }}>
          Infinity
        </button>
      </Space>
      <h3>code</h3>
      <pre>
        <code className="language-jsx">
          {`<Space align='center' colGap='10px' rowGap='10px'>
  <button
    className='btn atouch'
    onClick={() => {
      Toast.message({
        children: <div>hellow world</div>,
      })
    }}>
    message
  </button>
  <button
    className='btn atouch'
    onClick={() => {
      Toast.loading({
        duration: 1000,
        isMackClick: true
      })
    }}>
    loading
  </button>
  <button
    className='btn atouch'
    onClick={() => {
      const close = Toast.message({
        duration: Infinity,
        isShowMask: true,
        isMackClick: true,
        children: <div onClick={() => close?.()}>Click me to close!</div>,
      })
    }}>
    Infinity
  </button>
</Space>`}
        </code>
      </pre>
    </div>
  )
}

export const name = 'Toast'

export default Component