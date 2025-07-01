### Yuwan React Component

- [Yuwan React Component](#yuwan-react-component)
  - [install](#install)
  - [usage](#usage)
  - [Components](#components)
    - [Layout](#layout)
    - [Toast](#toast)
  - [Types](#types)
    - [ToastParams](#toastparams)
  - [SpaceProps](#spaceprops)

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

#### SpaceProps
  * wrap?: boolean
  * rowGap?: string
  * colGap?: string
  * children?: React.ReactNode
  * className?: string

