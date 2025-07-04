### Yuwan React Component

- [Yuwan React Component](#yuwan-react-component)
  - [install](#install)
  - [usage](#usage)
  - [Hooks](#hooks)
    - [useLuckDraw](#useluckdraw)
  - [Components](#components)
    - [Layout](#layout)
    - [Space](#space)
    - [Danmu](#danmu)
    - [Toast](#toast)
  - [Types](#types)
    - [ToastParams](#toastparams)
    - [SpaceProps](#spaceprops)
    - [DanmuProps](#danmuprops)
    - [useLuckDrawProps](#useluckdrawprops)

#### install
```javascript
pnpm add @daiyu-5577/yuwan-react
```

#### usage
```javascript
import { Layout as Yuwan, Toast } from 'yuwan-react'
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
}
```

#### Hooks

##### useLuckDraw
* [useLuckDrawProps](#useLuckDrawProps)
```javascript
const { run } = useLuckDraw({
  len: list.length,
  turns: 2,
  speed: 100,
  damping: 0.28,
  onUpdate,
  onEnd
})
```


#### Components

##### Layout
```javascript
import { App } from './App'
import { Layout as Yuwan } from 'yuwan-react'
import '@daiyu-5577/yuwan-react/index.css'

const App = () => {
  return (
    <Yuwan>
      <App />
    </Yuwan>
  )
}
```

##### Space
* [SpaceProps](#SpaceProps)
```javascript
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
```

##### Danmu
* [DanmuProps](#DanmuProps) 
```javascript
<Danmu
  CompItem={Item}
  list={list}
  delay={1000}
  speed={60}
  gapX={0}
  trackNum={2}
  trackheight={'10vw'}
/>
```

##### Toast
* Methods
  * message
    * [ToastParams](#ToastParams)
  * loading
    * [ToastParams](#ToastParams)
  * closeAll


#### Types

##### ToastParams
  * children?: ReactNode
  * duration?: number
  * isShowMask?: boolean
  * isDisabledClick?: boolean  

##### SpaceProps
  * wrap?: boolean
  * rowGap?: string
  * colGap?: string
  * align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  * direction?: 'row' | 'column'
  * split?: React.ReactNode
  * children?: React.ReactNode
  * className?: string

##### DanmuProps
  * CompItem: React.FC<T>
  * list: T[]
  * gapX?: number
  * gapY?: number
  * trackNum?: number
  * trackheight?: string
  * speed?: number
  * delay?: number
  * loop?: boolean
  * className?: string

##### useLuckDrawProps
  * len: number
  * turns: number
  * speed: number
  * damping: number
  * onUpdate: (index: number) => void
  * onEnd: (index: number) => void


