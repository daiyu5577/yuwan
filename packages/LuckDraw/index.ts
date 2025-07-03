import React, { useEffect, useRef, useState } from 'react'

interface Props {
  len: number; // 抽奖数组长度
  turns?: number; // 圈数 >= 1
  speed?: number; // 速度毫秒
  damping?: number; // 阻力 0-1
  onUpdate?: (index: number) => void;
  onEnd?: (index: number) => void;
}

export default function useLuckDraw(props: Props) {

  const { len, turns = 3, speed = 100, damping = 0.2, onUpdate, onEnd } = props;

  const timer = useRef<any>(0)

  const targetIndex = useRef<number>(-1)
  const lessDuration = useRef(speed)
  const allRunTimes = useRef<number>(0) // 总运行次数
  const curRunTimes = useRef<number>(0) // 当前运行次数

  const loop = () => {
    curRunTimes.current += 1
    onUpdate?.((curRunTimes.current - 1) % len)

    if (curRunTimes.current >= allRunTimes.current) {
      setTimeout(() => {
        onEnd?.(targetIndex.current!)
      }, lessDuration.current)
      return
    }

    if (curRunTimes.current / allRunTimes.current >= 3 / 5) {
      lessDuration.current *= (damping + 1)
    }

    timer.current = setTimeout(loop, lessDuration.current);
  }

  const run = (index: number) => {
    if (!index && index != 0) return
    targetIndex.current = index
    curRunTimes.current = 0
    allRunTimes.current = turns * len + index + 1
    lessDuration.current = speed
    loop()
  }

  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  return { run }
}
