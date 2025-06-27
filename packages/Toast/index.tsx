import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { generateUid } from '../utils/index'
import styles from './index.module.less'

interface ToastInfo {
  children: React.ReactNode
  duration?: number
  id: string
}

interface ToastItemParams {
  toastInfo: ToastInfo
  setList: React.Dispatch<React.SetStateAction<ToastInfo[]>>
}

function ToastItem(params: ToastItemParams) {

  const { toastInfo, setList } = params

  const timer = useRef<any>(0)

  const itemDom = useRef<HTMLDivElement>(null)

  const [isHiden, setIsHiden] = useState(false)

  useEffect(() => {
    if (toastInfo.duration != Infinity) {
      timer.current = setTimeout(() => {
        setIsHiden(true)
        itemDom.current?.addEventListener('animationend', () => {
          setList((list) => {
            return list.filter((v) => v.id !== toastInfo.id)
          })
        })
      }, toastInfo.duration as number)
    }

    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  return (
    <div ref={itemDom} className={`yw_toast ${styles.toast} ${isHiden ? `${styles.toastHide}` : ''}`}>
      {toastInfo.children}
    </div>
  )
}

export default function Toast() {

  const [list, setList] = useState<(ToastInfo)[]>([])

  // show
  const show = (params: Omit<ToastInfo, 'id'>) => {
    const { duration = 1000 } = params
    const id = generateUid('toast').padEnd(10, '0')
    const close = () => {
      setList((list) => {
        return list.filter((v) => v.id !== id)
      })
    }
    setList((list) => {
      return [...list, {
        ...params,
        duration,
        id,
      }]
    })
    if (duration == Infinity) return close
  }

  // closeAll
  const closeAll = () => {
    setList([])
  }

  useEffect(() => {
    Toast.show = show
    Toast.closeAll = closeAll
  }, [])


  return createPortal(
    <React.Fragment>
      {
        list.map(v => (
          <ToastItem
            toastInfo={v}
            setList={setList}
            key={v?.id} />
        ))
      }
    </React.Fragment>,
    document.body
  );
}

Toast.show = (_params: Omit<ToastInfo, 'id'>) => { }
Toast.closeAll = () => { }
