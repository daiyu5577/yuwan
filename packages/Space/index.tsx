import React from 'react'
import classNames from 'classnames'
import styles from './index.module.less'

interface Props {
  wrap?: boolean
  rowGap?: string
  colGap?: string
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  direction?: 'row' | 'column'
  split?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export default function Space(props: Props) {

  const {
    wrap = false,
    rowGap = '5px',
    colGap = '5px',
    align = 'flex-start',
    direction = 'row',
    split = <></>,
    children,
    className
  } = props

  return (
    <div
      className={classNames(styles['yw-space'], className)}
      style={{
        flexWrap: wrap ? 'wrap' : 'nowrap',
        justifyContent: align,
        alignItems: align,
        flexDirection: direction,
        rowGap: rowGap,
        columnGap: colGap,
      }}
    >
      {React.Children.map(children, (child, index) => {
        return [
          child,
          index !== React.Children.count(children) - 1 ? split : null
        ]
      })}
    </div>
  )
}