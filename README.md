### Yuwan React Component

- [Yuwan React Component](#yuwan-react-component)
  - [install](#install)
  - [usage](#usage)
  - [Components](#components)
    - [Layout](#layout)
    - [Toast](#toast)

#### install
```javascript
pnpm add @daiyu-5577/yuwan-react
```

#### usage
```javascript
import { Layout as Yuwan, Toast } from 'yuwan-react'
import '@daiyu-5577/yuwan-react/index.css'

const App = () => {
  const handleShowToast = () => {
    Toast.show({
      children: <div>hellow world</div>,
    })
  }
  return (
    <Yuwan>
      <button onClick={handleShowToast}>click</button>
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
  * show
    * children: ReactNode
    * duration: number
  * closeAll

