import { useRef, useState } from 'react'
import Carousel, { type CarouselRef } from '../../packages/Carousel'
import styles from './index.module.less'

interface SlideItem {
  title: string
  desc: string
  color: string
}

const list: SlideItem[] = [
  { title: '01', desc: '基础轮播', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { title: '02', desc: '自动播放', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { title: '03', desc: '循环无缝', color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { title: '04', desc: '手势滑动', color: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { title: '05', desc: '指示器', color: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { title: '06', desc: '懒渲染', color: 'linear-gradient(135deg, #30cfd0, #330867)' },
  { title: '07', desc: '一屏多张', color: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
  { title: '08', desc: '响应配置', color: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
]

const Slide = (props: SlideItem) => (
  <div className={'slide'} style={{ background: props.color }}>
    <div className={'slide-title'}>{props.title}</div>
    <div className={'slide-desc'}>{props.desc}</div>
  </div>
)

const CarouselDemo = () => {
  const ref = useRef<CarouselRef>(null)
  const [current, setCurrent] = useState(0)

  return (
    <div className={styles.carouselDemo}>
      <h3>example</h3>

      <div className={'section'}>
        <div className={'label'}>基础用法：自动播放 · 循环 · 指示点 · 箭头</div>
        <Carousel
          CompItem={Slide}
          list={list}
          height={220}
          loop
          autoplay
          interval={2500}
          arrows
          indicator="dots"
          onChange={setCurrent}
        />
        <div className={'tip'}>当前第 {current + 1} 张</div>
      </div>

      <div className={'section'}>
        <div className={'label'}>一屏多张 · 缩略图指示器</div>
        <Carousel
          CompItem={Slide}
          list={list}
          height={200}
          slidesPerView={3}
          gap={12}
          loop
          autoplay
          arrows
          indicator="thumbnail"
          getThumb={item => <div className={'thumb'} style={{ background: item.color }} />}
        />
      </div>

      <div className={'columns'}>
        <div className={'section'}>
          <div className={'label'}>垂直方向</div>
          <Carousel
            CompItem={Slide}
            list={list}
            height={240}
            direction="vertical"
            loop
            autoplay
            arrows
            indicator="dots"
          />
        </div>
        <div className={'section'}>
          <div className={'label'}>淡入淡出 · 进度条</div>
          <Carousel
            CompItem={Slide}
            list={list}
            height={240}
            effect="fade"
            loop
            autoplay
            arrows
            indicator="progress"
          />
        </div>
      </div>

      <div className={'section'}>
        <div className={'label'}>命令式调用 ref</div>
        <Carousel
          ref={ref}
          CompItem={Slide}
          list={list}
          height={200}
          loop
          indicator="dots"
        />
        <div className={'actions'}>
          <button className={'btn'} onClick={() => ref.current?.prev()}>上一张</button>
          <button className={'btn'} onClick={() => ref.current?.next()}>下一张</button>
          <button className={'btn'} onClick={() => ref.current?.goTo(2)}>跳到第 3 张</button>
          <button className={'btn'} onClick={() => console.log(ref.current?.getCurrent())}>
            获取当前下标
          </button>
        </div>
      </div>

      <div className={'section'}>
        <div className={'label'}>开启懒渲染</div>
        <Carousel
          CompItem={Slide}
          list={list}
          height={200}
          loop
          lazy
          lazyBuffer={2}
          arrows
          indicator="dots"
        />
      </div>

      <h3>code</h3>
      <pre>
        <code className="language-jsx">
          {`const list = [
  { title: '01', desc: '基础轮播', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
]

const Slide = (props: SlideItem) => (
  <div style={{ height: '100%', background: props.color }}>
    {props.title}
  </div>
)

<Carousel
  CompItem={Slide}
  list={list}
  height={220}
  loop
  autoplay
  interval={2500}
  arrows
  indicator="dots"
  onChange={(index) => console.log(index)}
/>

// 其它可选能力，按需开启
<Carousel
  CompItem={Slide}
  list={list}
  slidesPerView={3}      // 一屏多张
  gap={12}               // 间距
  direction="vertical"   // 垂直方向
  effect="fade"          // 淡入淡出
  indicator="thumbnail"  // dots | thumbnail | progress | none
  getThumb={(item) => <img src={item.cover} />}
  swipe                  // 手势滑动，默认开启
  lazy                   // 懒渲染
  current={index}        // 受控
  onChange={setIndex}
/>`}
        </code>
      </pre>
    </div>
  )
}

export default CarouselDemo
export const name = 'Carousel'
