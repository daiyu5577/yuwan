import React, { useEffect, useState, useRef, useContext } from 'react'
import { createPortal } from 'react-dom';
import style from './index.module.less'

interface Props {
  className?: string
  otherStyle?: React.CSSProperties
}

type ShowProps = {
  className?: string
  otherStyle?: React.CSSProperties
  children: React.ReactNode
  idPrefix?: string
  isShowMask?: boolean
  isClickMaskHide?: boolean
  onClickMask?: () => void
}

type ListItem = ShowProps & {
  id: string
  onClickMaskDom: () => void
}

export const generateId = (prefix: string) => {
  return `${prefix}_${Math.random().toString(36).substring(2)}_${Date.now()}`
}

export default function StackModal(props: Props) {

  const { className = '', otherStyle = {} } = props

  const [list, setList] = useState<ListItem[]>([])
  const [update, setUpdate] = useState<number>(0)

  const onShow = (params: ShowProps) => {
    const id = generateId(params.idPrefix || '')
    const onClickMaskDom = () => {
      if (params?.isClickMaskHide) {
        close(id)
        params?.onClickMask?.()
        return
      }
      params?.onClickMask?.()
    }
    const item = {
      ...params,
      id,
      onClickMaskDom
    }
    setList(v => [...v, item])
    return onClickMaskDom
  }

  const onHideAll = () => {
    setList([])
  }

  const onUpdate = () => {
    setUpdate(v => v += 1)
  }

  const close = (id: string) => {
    setList(list => list.filter(v => v.id != id))
  }

  useEffect(() => {
    StackModal.show = onShow
    StackModal.hideAll = onHideAll
    StackModal.update = onUpdate
  }, [])

  return (
    createPortal(
      <div className={`${style.baseModal} ${className}`} style={{ ...otherStyle }}>
        {
          list.map(v => (
            <div
              key={v.id}
              className={`stackItemModal ${v?.isShowMask || v?.isShowMask === undefined ? 'stackItemModal-mask' : ''} ${v.className}`}
              style={{ ...v.otherStyle }}
              onClick={v?.onClickMaskDom}
            >
              <div onClick={e => e.stopPropagation()} className="stackItemModal-cnt">
                {v.children}
              </div>
            </div>
          ))
        }
      </div>,
      document.body
    ) as React.JSX.Element
  )
}


StackModal.show = (params: ShowProps) => {
  return () => { }
}

StackModal.hideAll = () => { }

StackModal.update = () => { }
