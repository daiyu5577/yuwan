import React, { type FC } from 'react'
import Space from '../../packages/Space'

const Component: FC = () => {
  return (
    <div>
      <h3>example</h3>
      <Space
        wrap
        align='center'
        direction='row'
        split={<>😊</>}
        colGap='10px'
        rowGap='10px' >
        <button className='btn atouch'>buttom</button>
        <button className='btn atouch'>buttom</button>
      </Space >
      <h3>code</h3>
      <pre>
        <code className="language-jsx">
          {`<Space
  wrap
  align='center'
  direction='row'
  split={<>😊</>}
  colGap='10px'
  rowGap='10px' >
  <button>buttom</button>
  <button>buttom</button>
</Space >`}
        </code>
      </pre>
    </div>
  )
}

export const name = 'Space'

export default Component