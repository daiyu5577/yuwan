import React, { useState, useRef, useEffect, createContext } from "react";
import Toast from "../Toast";

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
}
const Layout = (props: LayoutProps) => {

  const { children } = props

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

  return (
    <LayoutContext.Provider value={{
      upSign,
      layoutUpdate,
      layoutReload,
    }}>
      {!isReload && children}
      <Toast />
    </LayoutContext.Provider>
  );
};
export default Layout

