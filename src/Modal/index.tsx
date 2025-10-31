import React, { type FC } from 'react'
import Space from '../../packages/Space'
import useModal from '../../packages/Modal'

const Modal = useModal()

const styles: React.CSSProperties = {
  width: '300px',
  height: '400px',
  background: '#fff',
  fontSize: '24px',
  color: '#000',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const Component: FC = () => {

  return (
    <div>
      <h3>example</h3>
      <Space align='center' colGap='10px' rowGap='10px'>
        <button
          className='btn atouch'
          onClick={() => {
            const { close } = Modal.show({
              children: <div
                style={styles}
                onClick={() => close?.()}>
                hellow world
              </div>,
            })
          }}>
          show modal
        </button>
        <button
          className='btn atouch'
          onClick={() => {
            const { close } = Modal.show({
              isClickMaskClose: false,
              children: <div
                style={styles}
                onClick={() => close?.()}>
                mask
              </div>,
            })
          }}>
          no close mask
        </button>
      </Space>
      <h3>code</h3>
      <pre>
        <code className="language-jsx">
          {`import useModal from '../../packages/Modal'

const Modal = useModal()

const styles: React.CSSProperties = {
  width: '300px',
  height: '400px',
  background: '#fff',
  fontSize: '24px',
  color: '#000',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const Component: FC = () => {

  return (
    <div>
      <h3>example</h3>
      <Space align='center' colGap='10px' rowGap='10px'>
        <button
          className='btn atouch'
          onClick={() => {
            const { close } = Modal.show({
              children: <div
                style={styles}
                onClick={() => close?.()}>
                hellow world
              </div>,
            })
          }}>
          show modal
        </button>
        <button
          className='btn atouch'
          onClick={() => {
            const { close } = Modal.show({
              isClickMaskClose: false,
              children: <div
                style={styles}
                onClick={() => close?.()}>
                mask
              </div>,
            })
          }}>
          no close mask
        </button>
      </Space>
      <h3>code</h3>
      <pre>
        <code className="language-jsx">

        </code>
      </pre>
      <Modal />
    </div>
  )
}`}
        </code>
      </pre>
      <Modal />
    </div>
  )
}

export const name = 'Modal'

export default Component