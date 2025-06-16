### Yuwan React Component

#### install
```javascript
pnpm add npm i @daiyu-5577/yuwan-react
```

#### usage
```javascript
import { Layout, Toast } from 'yuwan-react'

const App = () => {
  const handleShowToast = () => {
    Toast.show({
      children: <div>hellow world</div>,
    })
  }
  return (
    <Layout>
      <button onClick={handleShowToast}>click</button>
    </Layout>
  )
}
```
