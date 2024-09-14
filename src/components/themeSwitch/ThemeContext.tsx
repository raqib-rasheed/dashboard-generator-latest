import React, {
  createContext,
  useLayoutEffect,
  useState,
  useMemo,
  FC,
  ReactNode,
} from 'react'

import useDeviceScreen from '../../hooks/useDeviceScreen'

export interface IThemeContextProps {
  darkModeStatus: boolean
  mobileDesign: boolean
}
const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps)

interface IThemeContextProviderProps {
  children: ReactNode
}
export const ThemeContextProvider: FC<IThemeContextProviderProps> = ({
  children,
}) => {
  const deviceScreen: any = useDeviceScreen()
  const mobileDesign = deviceScreen?.width && deviceScreen?.width <= 700

  const [darkModeStatus] = useState(
    localStorage.getItem('facit_darkModeStatus')
      ? localStorage.getItem('facit_darkModeStatus') === 'true'
      : import.meta.env.VITE_DARK_MODE === 'true'
  )

  useLayoutEffect(() => {
    localStorage.setItem('facit_darkModeStatus', darkModeStatus.toString())
  }, [darkModeStatus])

  const values: IThemeContextProps = useMemo(
    () => ({
      darkModeStatus,
      mobileDesign,
    }),
    [darkModeStatus, mobileDesign]
  )

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  )
}

export default ThemeContext
