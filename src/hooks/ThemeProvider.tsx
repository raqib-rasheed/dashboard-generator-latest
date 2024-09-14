import { useEffect, useState } from 'react'

import colorThemes from '../components/visualisers/utils/chartColourThemes'

type IColorThemeTypes =
  | 'defaultTheme'
  | 'Violet'
  | 'Dark'
  | 'MonoBlue'
  | 'Green'
  | 'DarkGreen'

interface IUseThemeProviderProps {
  theme: IColorThemeTypes
}

export default function useThemeProvider(props?: IUseThemeProviderProps) {
  const [selectedTheme, setSelectedTheme] = useState<IColorThemeTypes>(
    props?.theme ?? 'defaultTheme'
  )
  const [colors, setColorThemes] = useState((colorThemes as any)[selectedTheme])

  useEffect(() => {
    setColorThemes((colorThemes as any)[selectedTheme])
  }, [selectedTheme])

  return { colors, colorThemes, selectedTheme, setSelectedTheme }
}
