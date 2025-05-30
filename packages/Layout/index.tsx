import React, { useState, useRef, useEffect, createContext } from "react";
import Toast from "../Toast";
import type Themes from '../theme.d'

interface LayoutContextProps {
  upSign: number
  layoutReload: () => void
  layoutUpdate: () => void
}

export const LayoutContext = createContext<LayoutContextProps>({
  upSign: 0,
  layoutUpdate: () => { },
  layoutReload: () => { },
})

interface LayoutProps {
  children?: React.ReactNode;
  themes?: Themes;
}
const Layout = (props: LayoutProps) => {

  const { children, themes = {} } = props

  const [isReload, setIsReload] = useState(false)
  const [upSign, setUpSign] = useState(0)

  const layoutUpdate = () => {
    setUpSign(upSign + 1)
  }

  const layoutReload = () => {
    setIsReload(true)
    setTimeout(() => {
      setIsReload(false)
    }, 100)
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

