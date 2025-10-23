import React, { ReactNode, useEffect } from 'react'
import { cms_dark } from './cms_dark'
import { sbl_dark } from './sbl_dark'

interface PlasmaThemeProviderProps {
  children: ReactNode
  theme: 'cms_dark' | 'sbl_dark'
}

export const PlasmaThemeProvider: React.FC<PlasmaThemeProviderProps> = ({
  children,
  theme
}) => {
  useEffect(() => {
    // Применяем CSS переменные Plasma темы
    const styleElement = document.createElement('style')
    const themeCSS = theme === 'cms_dark' ? cms_dark[0] : sbl_dark[0]
    
    styleElement.textContent = themeCSS
    document.head.appendChild(styleElement)

    // Добавляем классы для темы
    document.documentElement.classList.add(theme)
    
    return () => {
      // Очистка при размонтировании
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement)
      }
      document.documentElement.classList.remove('cms_dark', 'sbl_dark')
    }
  }, [theme])

  return <>{children}</>
}