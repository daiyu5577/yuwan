import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import classnames from "classnames"
import { generateUid } from '../utils/index'
import styles from './index.module.less'

interface ShowToasProps {
  className?: string
  children?: React.ReactNode
  duration?: number
  isShowMask?: boolean
  isMackClick?: boolean
}

interface ToastItemProps extends ShowToasProps {
  id: string
  type: 'message' | 'loading'
  isShow: boolean
  close: () => void
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


function ToastItem(params: ToastItemProps) {

  const { id, type, className, children, duration = 1000, isShow, isShowMask = false, isMackClick = false, close } = params

  const timer = useRef<any>(0)

  const itemDom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (duration != Infinity) {
      timer.current = setTimeout(() => {
        close()
      }, duration as number)
    }
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    const fn = () => {
      !isShow && Toast.spliceItem(id)
    }
    itemDom.current?.addEventListener('animationend', fn)
    return () => {
      itemDom.current?.removeEventListener('animationend', fn)
    }
  }, [isShow])

  return (
    <div className={classnames(
      `${styles.mask}`,
      className,
      {
        'yw-mask-show': isShowMask,
        'yw-mask-click': isMackClick
      })}>
      <div
        ref={itemDom}
        className={classnames(
          'yw-toast',
          {
            'yw-toast-hidden': !isShow
          }
        )}
      >
        {
          type == 'loading' ?
            !!children ?
              children :
              <div className="yw-toast-loading">
                <SvgLoading />
              </div> :
            children || <></>
        }
      </div>
    </div>
  )
}

export default function Toast() {

  const countRef = useRef(1)
  const [list, setList] = useState<(ToastItemProps)[]>([])

  const message = (params: ShowToasProps, type: 'message' | 'loading') => {
    const { duration = 1000 } = params
    const id = generateUid(`toast_${countRef.current}`)
    const toastItemProps: ToastItemProps = {
      ...params,
      duration,
      type,
      id,
      close() {
        toastItemProps.isShow = false
        setList(v => [...v])
      },
      isShow: true
    }
    setList(v => [...v, toastItemProps])
    countRef.current += 1
    return { id, close: toastItemProps.close }
  }

  const hide = (id: string) => {
    const cur = list.find(v => v.id === id)
    !!cur && cur.close()
  }

  const hideAll = () => {
    list.forEach(v => v.close())
  }

  const spliceItem = (id: string) => {
    setList(v => v.filter(v => v.id !== id))
  }

  useEffect(() => {
    Toast.message = (params: ShowToasProps) => {
      return message(params, 'message')
    }
    Toast.loading = (params: ShowToasProps) => {
      return message(params, 'loading')
    }
    Toast.hide = hide
    Toast.hideAll = hideAll
    Toast.spliceItem = spliceItem
  }, [])


  return createPortal(
    <React.Fragment>
      {
        list.map(v => (
          <ToastItem
            key={v?.id}
            {...v}
          />
        ))
      }
    </React.Fragment>,
    document.body
  );
}

Toast.message = (params: ShowToasProps) => {
  return { id: generateUid(), close: () => { } }
}

Toast.loading = (params: ShowToasProps) => {
  return { id: generateUid(), close: () => { } }
}

Toast.hide = (id: string) => { }

Toast.hideAll = () => { }

Toast.spliceItem = (id: string) => { }
