import React, { useCallback, useEffect, useState, useMemo, useRef, Children, useImperativeHandle } from 'react'
import { generateUid } from '../utils/index'
import styles from './index.module.less'

interface DanmuWrapProps<T> {
  CompItem: React.FC<T>
  list: T[]
  gapX?: number // x轴间距
  gapY?: number // y轴间距
  trackNum?: number // 轨道数
  trackheight?: string // 轨道高度
  speed?: number // 过渡速度
  delay?: number // 延迟
  loop?: boolean // 是否循环
}

// 0 未生成、1：动画中、2：已结束
type DanmuItem<T extends object> = { id: string, trackIndex: number, el: HTMLDivElement | null, state: number, info: T }
export default function DanmuWrap<T extends object>(props: DanmuWrapProps<T>) {

  const { CompItem, list, speed = 30, delay = 500, loop = true, gapX = 10, gapY = 10, trackNum = 0, trackheight = `${1 / trackNum * 100}%` } = props

  const timer = useRef<any>(0)
  const checkIndex = useRef(0)
  const DanmuWrapDOM = useRef<HTMLDivElement>(null)

  // 源数据
  const sourceList = useRef<DanmuItem<T>[]>([])
  // 轨道列表
  const [trackList, setTrackList] = useState<DanmuItem<T>[][]>(() => {
    return new Array(trackNum).fill(new Array()).map(v => [...v])
  }) // 轨道list

  const checkList = () => {
    if (!sourceList.current.length || !DanmuWrapDOM.current) return
    if (checkIndex.current > sourceList.current.length - 1 && loop) { checkIndex.current = 0 }
    const [item] = sourceList.current.slice(checkIndex.current, checkIndex.current + 1)
    if (!item) return

    // 弹幕对象
    const danmuItem = { ...item }
    // 生成id
    danmuItem.id = `${generateUid('danmu')}_${Date.now()}`

    const setCurItem = (trackIndex: number, curTrackItemArr: DanmuItem<T>[]) => {
      danmuItem.trackIndex = trackIndex
      danmuItem.state = 1
      curTrackItemArr.push(danmuItem)
      setTrackList([...trackList])
      checkIndex.current += 1
    }

    for (let i = 0; i < trackList.length; i++) {
      const curTrackItemArr = trackList[i]
      if (!curTrackItemArr.length) {
        setCurItem(i, curTrackItemArr)
        return
      }
      const lastDanmuItem = curTrackItemArr[curTrackItemArr.length - 1]
      const wrapWdith = DanmuWrapDOM.current!.offsetWidth
      if (!lastDanmuItem.el) return
      const { left, width } = lastDanmuItem.el.getBoundingClientRect()
      if (wrapWdith - left >= width + gapX) {
        setCurItem(i, curTrackItemArr)
        return
      }
    }
  }

  useEffect(() => {
    if (trackNum > trackList.length) {
      trackList.push(...new Array(trackNum - trackList.length).fill(new Array()).map(v => [...v]))
      setTrackList([...trackList])
    }
  }, [trackNum])

  useEffect(() => {
    DanmuWrap.add = (arr: typeof list) => {
      const newArr = arr.map((v) => ({
        id: '0',
        trackIndex: -1,
        el: null,
        state: 0,
        info: v
      }))
      sourceList.current.push(...newArr)
    }
    checkList()
  }, [])

  useEffect(() => {
    timer.current = setInterval(checkList, delay);
    return () => {
      clearInterval(timer.current)
    }
  }, [trackList])

  return (
    <div ref={DanmuWrapDOM} className={styles.danmuWrap}>
      {
        trackList?.map((v, i) => (
          <div className="danmuWrap-track" style={{ marginBottom: `${gapY}px`, height: trackheight }} key={i}>
            {
              v?.map((v) => (
                <DanmuItem
                  key={`${v.id}`}
                  // @ts-ignore
                  ref={(e) => v.el = e?.el as HTMLDivElement}
                  DanmuWrapDOM={DanmuWrapDOM.current}
                  speed={speed}
                  item={v}
                  onEnd={() => {
                    const curTrackItemArr = trackList[v.trackIndex] || []
                    const curItemIndex = curTrackItemArr.findIndex(item => item.id == v.id)
                    if (curItemIndex >= 0) {
                      curTrackItemArr.splice(curItemIndex, 1)
                      setTrackList([...trackList])
                    }
                  }}
                >
                  <CompItem {...v?.info} />
                </DanmuItem>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

DanmuWrap.add = (item: any) => { } // add item

interface DanmuItemProps {
  item: DanmuItem<object>
  DanmuWrapDOM: HTMLDivElement | null
  speed: number
  children: React.ReactNode
  onEnd: (trackIndex: number, id: string) => void
}
export const DanmuItem = React.forwardRef<{ el: HTMLDivElement | null }, DanmuItemProps>((props, toRef) => {


  const { item, speed, DanmuWrapDOM, children, onEnd } = props

  const itemDom = useRef<HTMLDivElement>(null)
  const [duration, setDuration] = useState(0)
  const [delay, setDelay] = useState(Math.random() * 500)

  useImperativeHandle(toRef, () => {
    return {
      el: itemDom.current
    }
  })

  useEffect(() => {
    if (!DanmuWrapDOM || !itemDom.current) return
    const moveX = DanmuWrapDOM.offsetWidth + itemDom.current.offsetWidth
    setDuration(moveX / speed)
    setTimeout(() => {
      itemDom.current!.style.left = `-${itemDom.current?.offsetWidth}px`
    }, 60)
  }, [DanmuWrapDOM, itemDom.current])

  return (
    <div
      ref={itemDom}
      className={styles.danmuItem}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}ms`
      }}
      onTransitionEnd={() => {
        onEnd(item?.trackIndex, item?.id)
      }}
    >
      {children}
    </div>
  )
})
