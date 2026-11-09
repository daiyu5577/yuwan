import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import classNames from 'classnames'
import styles from './index.module.less'

export type CarouselDirection = 'horizontal' | 'vertical'
export type CarouselEffect = 'slide' | 'fade'
export type CarouselIndicator = 'none' | 'dots' | 'thumbnail' | 'progress'
export type CarouselArrowsMode = 'always' | 'hover'

export interface CarouselRef {
  /** 下一张 */
  next: () => void
  /** 上一张 */
  prev: () => void
  /** 跳转到指定下标（slide 模式下为逐张下标，fade 模式下为分页下标） */
  goTo: (index: number) => void
  /** 获取当前下标 */
  getCurrent: () => number
}

export interface CarouselProps<T extends object> {
  /** 数据源 */
  list: T[]
  /** 每一项的渲染组件，item 的所有字段会作为 props 传入 */
  CompItem: React.ComponentType<T>
  className?: string
  style?: CSSProperties
  /** 容器高度，垂直方向轮播必须设置可计算的高度 */
  height?: number | string
  /** 一屏展示的数量，默认 1 */
  slidesPerView?: number
  /** 每一项之间的间距（px） */
  gap?: number
  /** 轮播方向，effect 为 fade 时不起作用 */
  direction?: CarouselDirection
  /** 切换效果 */
  effect?: CarouselEffect
  /** 切换动画时长（ms） */
  duration?: number
  /** 是否循环轮播 */
  loop?: boolean
  /** 是否自动播放 */
  autoplay?: boolean
  /** 自动播放间隔（ms） */
  interval?: number
  /** 鼠标悬停时暂停自动播放 */
  pauseOnHover?: boolean
  /** 受控下标 */
  current?: number
  /** 非受控初始下标 */
  defaultCurrent?: number
  /** 下标变化回调 */
  onChange?: (index: number) => void
  /** 是否展示左右箭头 */
  arrows?: boolean
  /** 箭头展示时机 */
  arrowsMode?: CarouselArrowsMode
  /** 指示器类型 */
  indicator?: CarouselIndicator
  /** 缩略图指示器的内容渲染，不传时展示序号 */
  getThumb?: (item: T, index: number) => ReactNode
  /** 是否允许手势 / 触摸滑动 */
  swipe?: boolean
  /** 触发切换的滑动阈值（px） */
  swipeThreshold?: number
  /** 是否开启懒渲染，进入可视范围前后才会渲染对应内容 */
  lazy?: boolean
  /** 懒渲染的预加载范围 */
  lazyBuffer?: number
  /** 每一项的外层 className */
  slideClassName?: string
  /** 无障碍标签 */
  ariaLabel?: string
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

interface ArrowIconProps {
  dir: 'prev' | 'next'
  vertical: boolean
}

const ArrowIcon = ({ dir, vertical }: ArrowIconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={vertical ? { transform: 'rotate(90deg)' } : undefined}
  >
    <polyline points={dir === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
  </svg>
)

function CarouselInner<T extends object>(props: CarouselProps<T>, ref: React.ForwardedRef<CarouselRef>) {
  const {
    list,
    CompItem,
    className,
    style,
    height = '100%',
    slidesPerView = 1,
    gap = 0,
    direction = 'horizontal',
    effect = 'slide',
    duration = 300,
    loop = false,
    autoplay = false,
    interval = 3000,
    pauseOnHover = true,
    current,
    defaultCurrent = 0,
    onChange,
    arrows = false,
    arrowsMode = 'hover',
    indicator = 'none',
    getThumb,
    swipe = true,
    swipeThreshold = 40,
    lazy = false,
    lazyBuffer = 1,
    slideClassName,
    ariaLabel,
  } = props

  const len = list.length
  const isFade = effect === 'fade'
  const isVertical = direction === 'vertical' && !isFade
  const perView = Math.max(1, Math.min(Math.floor(slidesPerView) || 1, Math.max(len, 1)))
  const pageCount = Math.max(1, Math.ceil(len / perView))
  // 一屏多张时循环需要渲染多份数据，数量不足时不开启
  const canLoop = loop && len > 1 && (isFade ? pageCount > 1 : len > perView)
  const maxIndex = isFade ? pageCount - 1 : canLoop ? len - 1 : Math.max(len - perView, 0)
  const indexCount = maxIndex + 1

  // 循环模式下 slide 会渲染三份数据，真实下标对应的虚拟下标需要偏移一份
  const toVirtual = useCallback((index: number) => {
    const target = clamp(index, 0, maxIndex)
    return canLoop && !isFade ? len + target : target
  }, [canLoop, isFade, len, maxIndex])

  const fromVirtual = useCallback((value: number) => {
    if (isFade) {
      return canLoop ? ((value % pageCount) + pageCount) % pageCount : clamp(value, 0, maxIndex)
    }
    if (canLoop) return ((value % len) + len) % len
    return clamp(value, 0, maxIndex)
  }, [canLoop, isFade, len, pageCount, maxIndex])

  const [virtualIndex, setVirtualIndex] = useState<number>(() =>
    toVirtual(clamp(current ?? defaultCurrent, 0, maxIndex)),
  )
  const [viewportSize, setViewportSize] = useState(0)
  const [measured, setMeasured] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [disableTransition, setDisableTransition] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [ready, setReady] = useState<Set<number>>(() => {
    const set = new Set<number>()
    if (lazy) {
      for (let i = 0; i < Math.min(len, perView + lazyBuffer); i++) set.add(i)
    }
    return set
  })

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const virtualRef = useRef(virtualIndex)
  const dragCleanupRef = useRef<(() => void) | undefined>(undefined)
  const suppressClickRef = useRef(false)

  const realIndex = fromVirtual(virtualIndex)
  const lastIndexRef = useRef(realIndex)

  const slideSize = viewportSize > 0 ? Math.max(0, (viewportSize - gap * (perView - 1)) / perView) : 0
  const step = slideSize + gap
  const paused = pauseOnHover && hovering
  const activeItemIndex = isFade ? realIndex * perView : realIndex

  useLayoutEffect(() => {
    virtualRef.current = virtualIndex
  }, [virtualIndex])

  const measure = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    const size = isVertical ? el.clientHeight : el.clientWidth
    setViewportSize(prev => (prev === size ? prev : size))
    setMeasured(prev => prev || size > 0)
  }, [isVertical])

  // 首次挂载与布局参数变化后同步一次尺寸
  useLayoutEffect(() => {
    measure()
  }, [measure, len, perView])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    // 优先监听容器尺寸变化，容器不支持时退化为 window resize
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => measure())
      observer.observe(el)
      return () => observer.disconnect()
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  // 循环回跳时先关闭过渡，保证视觉上无位移
  useLayoutEffect(() => {
    if (!disableTransition) return
    const el = trackRef.current
    if (el) void el.offsetHeight
    setDisableTransition(false)
  }, [disableTransition])

  useEffect(() => {
    if (realIndex === lastIndexRef.current) return
    lastIndexRef.current = realIndex
    onChange?.(realIndex)
  }, [realIndex, onChange])

  // 受控下标变化时同步到内部位置
  useEffect(() => {
    if (current === undefined) return
    const target = clamp(Math.floor(current), 0, maxIndex)
    setVirtualIndex(value => (fromVirtual(value) === target ? value : toVirtual(target)))
  }, [current, maxIndex, fromVirtual, toVirtual])

  // 数据量 / 展示数量变化后，把非受控的位置修正到合法范围
  useEffect(() => {
    if (current !== undefined) return
    const target = toVirtual(clamp(lastIndexRef.current, 0, maxIndex))
    setVirtualIndex(value => (fromVirtual(value) === fromVirtual(target) ? value : target))
  }, [current, maxIndex, fromVirtual, toVirtual])

  const goTo = useCallback((index: number) => {
    setVirtualIndex(value => {
      const target = toVirtual(index)
      return target === value ? value : target
    })
  }, [toVirtual])

  const stepBy = useCallback((dir: 1 | -1) => {
    if (len <= 1) return
    setVirtualIndex(value => {
      if (isFade) {
        if (canLoop) return ((value + dir) % pageCount + pageCount) % pageCount
        return clamp(value + dir, 0, maxIndex)
      }
      if (!canLoop) return clamp(value + dir, 0, maxIndex)
      const nextValue = value + dir
      // 三份数据的合法起点范围，越界时等待 transitionend 回跳
      if (nextValue < 0 || nextValue > len * 3 - perView) return value
      return nextValue
    })
  }, [len, isFade, canLoop, pageCount, maxIndex, perView])

  const next = useCallback(() => stepBy(1), [stepBy])
  const prev = useCallback(() => stepBy(-1), [stepBy])

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || isFade || !canLoop) return
    const value = virtualRef.current
    if (value >= len * 2) {
      setDisableTransition(true)
      setVirtualIndex(value - len)
    } else if (value < len) {
      setDisableTransition(true)
      setVirtualIndex(value + len)
    }
  }

  useEffect(() => {
    if (!autoplay || len <= 1 || paused) return
    if (!canLoop && realIndex >= maxIndex) return
    const timer = window.setInterval(() => {
      if (document.hidden) return
      stepBy(1)
    }, Math.max(interval, 200))
    return () => window.clearInterval(timer)
  }, [autoplay, interval, paused, len, canLoop, realIndex, maxIndex, stepBy])

  useEffect(() => {
    if (!lazy || len === 0) return
    setReady(prevSet => {
      const nextSet = new Set(prevSet)
      const from = activeItemIndex - perView - lazyBuffer
      const to = activeItemIndex + perView + lazyBuffer
      for (let i = from; i <= to; i++) {
        let index = i
        if (canLoop) index = ((i % len) + len) % len
        if (index < 0 || index >= len) continue
        nextSet.add(index)
      }
      return nextSet.size === prevSet.size ? prevSet : nextSet
    })
  }, [lazy, activeItemIndex, perView, lazyBuffer, canLoop, len])

  useEffect(() => () => {
    dragCleanupRef.current?.()
  }, [])

  const dampenDrag = (offset: number) => {
    if (canLoop) return offset
    const atStart = virtualIndex <= 0
    const atEnd = virtualIndex >= maxIndex
    if ((atStart && offset > 0) || (atEnd && offset < 0)) return offset * 0.35
    return offset
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!swipe || len <= 1) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragCleanupRef.current?.()

    const startX = event.clientX
    const startY = event.clientY
    const startTime = Date.now()
    let moved = false

    const getDelta = (clientX: number, clientY: number) =>
      isVertical ? clientY - startY : clientX - startX

    const handleMove = (ev: PointerEvent) => {
      const delta = getDelta(ev.clientX, ev.clientY)
      if (!moved) {
        if (Math.abs(delta) < 4) return
        moved = true
        suppressClickRef.current = true
        setDragging(true)
      }
      setDragOffset(dampenDrag(delta))
    }

    const cleanup = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleEnd)
      window.removeEventListener('pointercancel', handleEnd)
      dragCleanupRef.current = undefined
    }

    const handleEnd = (ev: PointerEvent) => {
      cleanup()
      if (!moved) return
      const delta = getDelta(ev.clientX, ev.clientY)
      const elapsed = Math.max(Date.now() - startTime, 1)
      const velocity = delta / elapsed
      if (Math.abs(delta) > swipeThreshold || Math.abs(velocity) > 0.5) {
        stepBy(delta < 0 ? 1 : -1)
      }
      setDragOffset(0)
      setDragging(false)
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 100)
    }

    dragCleanupRef.current = cleanup
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleEnd)
    window.addEventListener('pointercancel', handleEnd)
  }

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return
    suppressClickRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const key = event.key
    if (key === 'ArrowLeft' || key === 'ArrowUp') prev()
    else if (key === 'ArrowRight' || key === 'ArrowDown') next()
    else if (key === 'Home') goTo(0)
    else if (key === 'End') goTo(maxIndex)
    else return
    event.preventDefault()
  }

  useImperativeHandle(ref, () => ({
    next,
    prev,
    goTo,
    getCurrent: () => fromVirtual(virtualRef.current),
  }), [next, prev, goTo, fromVirtual])

  const renderedSlides = useMemo(() => {
    if (isFade) return []
    const source = canLoop ? [...list, ...list, ...list] : list
    return source.map((item, index) => ({
      item,
      key: index,
      itemIndex: canLoop ? index % len : index,
    }))
  }, [list, canLoop, len, isFade])

  const fadePages = useMemo(() => {
    const pages: { item: T; itemIndex: number }[][] = []
    for (let start = 0; start < len; start += perView) {
      pages.push(list.slice(start, start + perView).map((item, offset) => ({
        item,
        itemIndex: start + offset,
      })))
    }
    return pages
  }, [list, len, perView])

  const getSlideStyle = (): CSSProperties => {
    const size = slideSize || `${100 / perView}%`
    if (isVertical) return { width: '100%', height: size, marginBottom: gap }
    return { width: size, height: '100%', marginRight: gap }
  }

  const renderSlideContent = (item: T, itemIndex: number) => {
    if (lazy && !ready.has(itemIndex)) return <div className='carousel-placeholder' />
    return <CompItem {...item} />
  }

  const trackStyle: CSSProperties = {
    transform: isVertical
      ? `translate3d(0, ${-(virtualIndex * step) + dragOffset}px, 0)`
      : `translate3d(${-(virtualIndex * step) + dragOffset}px, 0, 0)`,
    transitionDuration: `${measured && !dragging && !disableTransition ? duration : 0}ms`,
  }

  return (
    <div
      className={classNames(
        styles.carouselWrap,
        isVertical && styles.carouselVertical,
        dragging && styles.carouselGrabbing,
        className,
      )}
      style={{ height: typeof height === 'number' ? `${height}px` : height, ...style }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        ref={viewportRef}
        className={classNames('carousel-viewport', swipe && len > 1 && 'carousel-viewport-draggable')}
        style={{ userSelect: dragging ? 'none' : undefined }}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
        onDragStart={event => event.preventDefault()}
        onKeyDown={handleKeyDown}
      >
        {isFade ? (
          fadePages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className={classNames('carousel-page', pageIndex === realIndex && 'carousel-page-active')}
              style={{ transitionDuration: `${!measured || dragging ? 0 : duration}ms` }}
            >
              {page.map(({ item, itemIndex }) => (
                <div
                  key={itemIndex}
                  className={classNames('carousel-slide', slideClassName)}
                  style={getSlideStyle()}
                >
                  {renderSlideContent(item, itemIndex)}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div
            ref={trackRef}
            className='carousel-track'
            style={trackStyle}
            onTransitionEnd={handleTransitionEnd}
          >
            {renderedSlides.map(({ item, itemIndex, key }) => (
              <div
                key={key}
                className={classNames('carousel-slide', slideClassName)}
                style={getSlideStyle()}
              >
                {renderSlideContent(item, itemIndex)}
              </div>
            ))}
          </div>
        )}
      </div>

      {arrows && indexCount > 1 && (
        <>
          <button
            type="button"
            aria-label="上一张"
            className={classNames('carousel-arrow', 'carousel-arrow-prev', arrowsMode === 'hover' && 'carousel-arrow-hover')}
            disabled={!canLoop && realIndex <= 0}
            onClick={prev}
          >
            <ArrowIcon dir="prev" vertical={isVertical} />
          </button>
          <button
            type="button"
            aria-label="下一张"
            className={classNames('carousel-arrow', 'carousel-arrow-next', arrowsMode === 'hover' && 'carousel-arrow-hover')}
            disabled={!canLoop && realIndex >= maxIndex}
            onClick={next}
          >
            <ArrowIcon dir="next" vertical={isVertical} />
          </button>
        </>
      )}

      {len > 0 && indicator === 'dots' && indexCount > 1 && (
        <div className='carousel-dots'>
          {Array.from({ length: indexCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`切换到第 ${index + 1} 张`}
              aria-current={index === realIndex ? 'true' : undefined}
              className={classNames('carousel-dot', index === realIndex && 'carousel-dot-active')}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}

      {len > 0 && indicator === 'thumbnail' && indexCount > 1 && (
        <div className='carousel-thumbs'>
          {Array.from({ length: indexCount }, (_, index) => {
            const itemIndex = isFade ? Math.min(index * perView, len - 1) : index
            const item = list[itemIndex]
            return (
              <button
                key={index}
                type="button"
                aria-label={`切换到第 ${index + 1} 张`}
                aria-current={index === realIndex ? 'true' : undefined}
                className={classNames('carousel-thumb', index === realIndex && 'carousel-thumb-active')}
                onClick={() => goTo(index)}
              >
                {getThumb && item ? getThumb(item, itemIndex) : (
                  <span className='carousel-thumb-fallback'>{index + 1}</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {len > 0 && indicator === 'progress' && (
        <div className='carousel-progress'>
          <div
            key={`${realIndex}-${autoplay}`}
            className={classNames(
              'carousel-progress-bar',
              autoplay && (canLoop || realIndex < maxIndex) && styles.carouselProgressBarAnimated,
            )}
            style={autoplay && (canLoop || realIndex < maxIndex)
              ? {
                animationDuration: `${Math.max(interval, 200)}ms`,
                animationPlayState: paused ? 'paused' : 'running',
              }
              : { width: `${((realIndex + 1) / indexCount) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

const Carousel = forwardRef(CarouselInner) as unknown as <T extends object>(
  props: CarouselProps<T> & { ref?: React.Ref<CarouselRef> },
) => React.ReactElement

export default Carousel
