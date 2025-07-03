import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import Danmu from '../../packages/Danmu'
import styles from './index.module.less'

const txt = `断了的弦 再怎么练 我的感觉你已听不见 你的转变像断掉的弦 再怎么接音都不对 你的改变我能够分辨 我沉默 你的话也不多 我们之间少了什么不说 哎哟 微笑后表情终于有点难过 握着你的手 问你确定了再走 我突然释怀的笑 笑声盘旋半山腰 随风在飘摇啊摇 来到你的面前绕 你泪水往下的掉 说会记住我的好 我也弯起了嘴角笑 你的美已经给了谁 追了又追我要不回 我了解离开树的叶 属于地上的世界凋谢`

const list = txt.split(' ').map(v => ({
  txt: v
}))

type LIstItem = typeof list[number]

const Item = (props: LIstItem) => {
  return (
    <div className={styles.item}>
      <div className="item-head"></div>
      <div className="item-txt">{props?.txt}</div>
    </div>
  )
}

export default function index() {

  useEffect(() => {
    Danmu.add(list)
  }, [])

  return (
    <div>
      <h3>example</h3>
      <div className={styles.home}>
        <Danmu
          CompItem={Item}
          list={list}
          delay={1000}
          speed={60}
          gapX={0}
          trackNum={2}
          trackheight={'10vw'}
        />
      </div>
      <h3>code</h3>
      <pre>
        <code className="language-jsx">
          {`const Item = (props: LIstItem) => {
  return (
    <div className={styles.item}>
      <div className="item-head"></div>
      <div className="item-txt">{props?.txt}</div>
    </div>
  )
}

<Danmu
  CompItem={Item}
  list={list}
  speed={60}
  gapX={0}
  trackNum={3}
/>`}
        </code>
      </pre>
    </div>
  )
}

export const name = 'Danmu'
