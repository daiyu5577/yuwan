import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import Toast from "../Toast";
export interface Themes {
  '--tost-duration': string
}
interface LayoutContextProps {
  upSign: number
  layoutReload: () => void
  layoutUpdate: () => void
}

const LayoutContext = createContext<LayoutContextProps>({
  upSign: 0,
  layoutUpdate: () => { },
  layoutReload: () => { },
})

export const useLayout = () => {
  return useContext(LayoutContext)
}

interface LayoutProps {
  children?: React.ReactNode
  themes?: Themes
  reLoadDuration?: number
}
const Layout = (props: LayoutProps) => {

  const { children, themes = {}, reLoadDuration = 100 } = props

  const [isReload, setIsReload] = useState(false)
  const [upSign, setUpSign] = useState(0)

  const layoutUpdate = () => {
    setUpSign(upSign + 1)
  }

  const layoutReload = () => {
    setIsReload(true)
    setTimeout(() => {
      setIsReload(false)
    }, reLoadDuration)
  }

  const styles = Object.entries(themes).map(([key, value]) => {
    return `${key}: ${value};`
  }).join('')

  return (
    <LayoutContext.Provider value={{
      upSign,
      layoutUpdate,
      layoutReload,
    }}>
      {!isReload && children}
      <Toast />
      <style>{`:root { ${styles} }`}</style>
    </LayoutContext.Provider>
  );
};
export default Layout

