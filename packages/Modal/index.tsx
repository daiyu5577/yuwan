import React, { useEffect, useState, useRef, useContext } from 'react'
import { createPortal } from 'react-dom';
import { generateUid } from '../utils/index'
import style from './index.module.less'

type ShowModalProps = {
  children: React.ReactNode
  className?: string
  otherStyle?: React.CSSProperties
  isClickMaskClose?: boolean
  onClickMask?: () => void
}
type ModalItemProps = ShowModalProps & {
  id: string
  isShow: boolean
  close: () => void
}

export default function useModal() {

  function ItemModal(props: ModalItemProps) {

    const {
      id,
      isClickMaskClose = true,
      children,
      otherStyle,
      className = '',
      close,
      onClickMask,
      isShow
    } = props

    return (
      <div
        id={id}
        className={`${style.itemModal} ${className}`}
        style={{ ...otherStyle }}
        onClick={() => {
          onClickMask?.()
          isClickMaskClose && close()
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          onAnimationEnd={() => {
            !isShow && Modal?.spliceItem(id)
          }}
          className={`itemModalCnt ${isShow ? '' : 'itemModalCnt-close'}`}
        >
          {children}
        </div>
      </div>
    )
  }

  function Modal() {

    const countRef = useRef(1)
    const [list, setList] = useState<(ModalItemProps)[]>([])

    const show = (props: ShowModalProps) => {
      const id = generateUid(`itemModal_${countRef.current}`)
      const modalItemProps: ModalItemProps = {
        ...props,
        id,
        close() {
          modalItemProps.isShow = false
          setList(v => [...v])
        },
        isShow: true
      }
      setList(v => [...v, modalItemProps])
      countRef.current += 1
      return { id, close: modalItemProps.close }
    }

    const hide = (id: string) => {
      const cur = list.find(v => v.id === id)
      !!cur && cur.close()
    }

    const spliceItem = (id: string) => {
      setList(v => v.filter(v => v.id !== id))
    }

    const updateModal = (id: string, props: ShowModalProps) => {
      setList(v => v.map((item) => item.id === id ? Object.assign(item, props) : item))
    }

    useEffect(() => {
      Modal.show = show
      Modal.hide = hide
      Modal.spliceItem = spliceItem
      Modal.updateModal = updateModal
    })

    return (
      createPortal(
        <React.Fragment>
          {
            list.map((item) => (
              <ItemModal
                key={item.id}
                {...item}
              />
            ))
          }
        </React.Fragment>,
        document.body
      ) as React.JSX.Element
    )

  }

  Modal.show = (props: ShowModalProps) => {
    return { id: generateUid(), close: () => { } }
  }

  Modal.hide = (id: string) => { }

  Modal.spliceItem = (id: string) => { }

  Modal.updateModal = (id: string, props: ShowModalProps) => { }

  return Modal

}