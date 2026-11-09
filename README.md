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
    - [Carousel](#carousel)
    - [Toast](#toast)
    - [Modal](#modal)
  - [Types](#types)
    - [ShowToasProps](#showtoasprops)
    - [SpaceProps](#spaceprops)
    - [DanmuProps](#danmuprops)
    - [CarouselProps](#carouselprops)
    - [CarouselRef](#carouselref)
    - [useLuckDrawProps](#useluckdrawprops)
    - [ShowModalProps](#showmodalprops)

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
      isMaskClick: true
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
import { Layout as Yuwan, Modal } from 'yuwan-react'
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

##### Carousel
* [CarouselProps](#CarouselProps)
* [CarouselRef](#CarouselRef)
```javascript
import { useRef } from 'react'
import { Carousel } from 'yuwan-react'
import type { CarouselRef } from 'yuwan-react'

const list = [
  { title: '01', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { title: '02', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
]

const Slide = (props: typeof list[number]) => (
  <div style={{ height: '100%', background: props.color }}>{props.title}</div>
)

const App = () => {
  const ref = useRef<CarouselRef>(null)

  return (
    <Carousel
      ref={ref}
      CompItem={Slide}
      list={list}
      height={220}
      loop
      autoplay
      interval={3000}
      arrows
      indicator='dots'
      onChange={(index) => console.log(index)}
    />
  )
}
```
* 所有能力均为可选配置，不开启时保持最简的静态展示
* 常用组合
  * 一屏多张：`slidesPerView={3}` + `gap={12}`
  * 垂直方向：`direction='vertical'`（需要可计算高度）
  * 淡入淡出：`effect='fade'`
  * 缩略图指示器：`indicator='thumbnail'` + `getThumb`
  * 进度条指示器：`indicator='progress'`，自动播放时随切换重置
  * 懒渲染：`lazy` + `lazyBuffer`
  * 手势滑动：`swipe`（默认开启）+ `swipeThreshold`

##### Toast
* Methods
  * message
    * (params: ShowToasProps | string) => string
    * [ShowToasProps](#ShowToasProps)
  * loading
    * (params: ShowToasProps) => string
    * [ShowToasProps](#ShowToasProps)
  * hide
    * (id: string) => void
  * hideAll
    * () => void

##### Modal
* Methods
  * show
    * (params: ShowModalProps) => string
    * [ShowModalProps](#ShowModalProps)
  * hide
    * (id: string) => void



#### Types

##### ShowToasProps
  * className?: string
  * children?: React.ReactNode
  * duration?: number
  * isShowMask?: boolean
  * isMaskClick?: boolean

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

##### CarouselProps
  * list: T[]
  * CompItem: React.ComponentType<T>
  * className?: string
  * style?: React.CSSProperties
  * height?: number | string
  * slidesPerView?: number
  * gap?: number
  * direction?: 'horizontal' | 'vertical'
  * effect?: 'slide' | 'fade'
  * duration?: number
  * loop?: boolean
  * autoplay?: boolean
  * interval?: number
  * pauseOnHover?: boolean
  * current?: number
  * defaultCurrent?: number
  * onChange?: (index: number) => void
  * arrows?: boolean
  * arrowsMode?: 'always' | 'hover'
  * indicator?: 'none' | 'dots' | 'thumbnail' | 'progress'
  * getThumb?: (item: T, index: number) => React.ReactNode
  * swipe?: boolean
  * swipeThreshold?: number
  * lazy?: boolean
  * lazyBuffer?: number
  * slideClassName?: string
  * ariaLabel?: string

##### CarouselRef
  * next: () => void
  * prev: () => void
  * goTo: (index: number) => void
  * getCurrent: () => number

##### useLuckDrawProps
  * len: number
  * turns: number
  * speed: number
  * damping: number
  * onUpdate: (index: number) => void
  * onEnd: (index: number) => void

##### ShowModalProps
  * children: React.ReactNode
  * className?: string
  * otherStyle?: React.CSSProperties
  * isClickMaskClose?: boolean
