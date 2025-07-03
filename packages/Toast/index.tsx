import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import classnames from "classnames"
import { generateUid } from '../utils/index'
import styles from './index.module.less'

interface ToastInfo {
  id: string
  type: 'message' | 'loading'
  children?: React.ReactNode
  duration?: number
  isShowMask?: boolean
  isDisabledClick?: boolean
}

interface ToastItemParams {
  toastInfo: ToastInfo
  setList: React.Dispatch<React.SetStateAction<ToastInfo[]>>
}

export const SvgLoading = (params: { width?: number, height?: number, stroke?: string, strokeWidth?: number }) => {
  const { width = 50, height = 50, stroke = "#fff", strokeWidth = 4 } = params
  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <path
        d={`M${strokeWidth} ${height / 2} A${(width - 2 * strokeWidth) / 2} ${(height - 2 * strokeWidth) / 2} 0 0 1 ${width - strokeWidth} ${height / 2} A${(width - 2 * strokeWidth) / 2} ${(height - 2 * strokeWidth) / 2} 0 0 1 ${width / 2} ${height - strokeWidth}`}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      ></path>
    </svg>
  )
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
    <div className={classnames(
      `${styles.mask}`,
      {
        'yw-mask-hidden': !toastInfo?.isShowMask,
        'yw-mask-disabled': !!toastInfo?.isDisabledClick
      })}>
      <div ref={itemDom} className={`yw-toast ${isHiden ? `yw-toast-hidden` : ''}`}>
        {
          toastInfo?.type == 'loading' ?
            !!toastInfo?.children ?
              toastInfo.children :
              <div className="yw-toast-loading">
                <SvgLoading />
              </div> :
            toastInfo.children || <></>
        }
      </div>
    </div>
  )
}

export default function Toast() {

  const [list, setList] = useState<(ToastInfo)[]>([])

  // message
  const message = (params: Omit<ToastInfo, 'id' | 'type'>, type: 'message' | 'loading') => {
    const { duration = 1000 } = params
    const id = generateUid('toast')
    const close = () => {
      setList((list) => {
        return list.filter((v) => v.id !== id)
      })
    }
    setList((list) => {
      return [...list, {
        ...params,
        duration,
        type,
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
    Toast.message = (params: Omit<ToastInfo, 'id' | 'type'>) => {
      return message(params, 'message')
    }
    Toast.loading = (params: Omit<ToastInfo, 'id' | 'type'>) => {
      return message(params, 'loading')
    }
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

Toast.message = (params: Omit<ToastInfo, 'id' | 'type'>) => {
  return params?.duration === Infinity ? () => { } : undefined
}
Toast.loading = (params: Omit<ToastInfo, 'id' | 'type'>) => {
  return params?.duration === Infinity ? () => { } : undefined
}
Toast.closeAll = () => { }
