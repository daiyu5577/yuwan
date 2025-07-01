import classNames from 'classnames'
import styles from './index.module.less'

interface Props {
  wrap?: boolean
  rowGap?: string
  colGap?: string
  children?: React.ReactNode
  className?: string
}

export default function Space(props: Props) {

  const { wrap = false, rowGap = '5px', colGap = '5px', children, className } = props

  return (
    <div
      className={classNames(styles['yw-space'], className)}
      style={{
        flexWrap: wrap ? 'wrap' : 'nowrap',
        rowGap: rowGap,
        columnGap: colGap,
      }}
    >
      {children}
    </div>
  )
}