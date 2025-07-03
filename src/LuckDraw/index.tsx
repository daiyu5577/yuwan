import React, { type FC, useEffect, useRef, useState } from 'react'
import useLuckDraw from '../../packages/LuckDraw'
import Toast from '../../packages/Toast'
import styles from "./index.module.less"

const list = [1, 2, 3, 4, 5, 6, 7, 8]
// 抽奖组件
const Component: FC = () => {

  const [target, setTarget] = useState<number>()
  const [curIndex, setCurIndex] = useState(-1)
  const [isEnd, setIsEnd] = useState(true)

  const onUpdate = (index: number) => {
    setCurIndex(index)
  }

  const onEnd = (index: number) => {
    setIsEnd(true)
    Toast.message({
      children: `🎉 --- ${index + 1} --- 🎉`
    })
  }

  const { run } = useLuckDraw({
    len: list.length,
    turns: 2,
    speed: 100,
    damping: 0.28,
    onUpdate,
    onEnd
  })

  const handleStart = () => {
    if (!isEnd) return
    const index = Math.floor(Math.random() * list.length)
    setTarget(index)
    run(index)
    setIsEnd(false)
  }

  return (
    <div>
      <h3>example</h3>
      <div className={styles.luckDraw}>
        <div className="list">
          {list.map((v, i) => (<div className={`luckDraw-item ${curIndex == i ? 'actived' : ''}`} key={i}>{v}</div>))}
        </div>
        <button className='btn' onClick={handleStart}>start</button>
        <div className="target">lunck number：{target ? target + 1 : ''}</div>
      </div>
      <h3>code</h3>
      <pre>
        <code className="language-jsx">
          {`const [target, setTarget] = useState<number>()
const [curIndex, setCurIndex] = useState(-1)
const [isEnd, setIsEnd] = useState(true)

const onUpdate = (index: number) => {
  setCurIndex(index)
}

const onEnd = (index: number) => {
  setIsEnd(true)
  Toast.message({
    children: \`🎉 --- \${index + 1} --- 🎉\`
  })
}

const { run } = useLuckDraw({
  len: list.length,
  turns: 2,
  speed: 100,
  damping: 0.3,
  onUpdate,
  onEnd
})

const handleStart = () => {
  if (!isEnd) return
  const index = Math.floor(Math.random() * list.length)
  setTarget(index)
  run(index)
  setIsEnd(false)
}`}
        </code>
      </pre>
    </div>
  )
}

export const name = 'LuckDraw'

export default Component