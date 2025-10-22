import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { Theme, ThemeType } from '@/types/theme'
import { PURPLE_THEME, GREEN_THEME } from '@/constants/themes'

interface ThemeContextType {
  theme: Theme
  currentTheme: ThemeType
  toggleTheme: (newTheme: ThemeType) => void
  setBusinessMode: (isBusinessMode: boolean) => void
  isBusinessMode: boolean
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('purple')
  const [isBusinessMode, setIsBusinessMode] = useState<boolean>(false)
  
  // Восстановление темы из localStorage при загрузке
  useEffect(() => {
    const savedTheme = localStorage.getItem('chat-theme') as ThemeType
    const savedBusinessMode = localStorage.getItem('chat-business-mode') === 'true'
    
    if (savedTheme && (savedTheme === 'purple' || savedTheme === 'green')) {
      setCurrentTheme(savedTheme)
    }
    
    if (savedBusinessMode) {
      setIsBusinessMode(true)
      // При восстановлении бизнес-режима автоматически переключаем на зеленую тему
      if (savedTheme !== 'green') {
        setCurrentTheme('green')
        localStorage.setItem('chat-theme', 'green')
      }
    }
  }, [])

  const theme = currentTheme === 'purple' ? PURPLE_THEME : GREEN_THEME

  const toggleTheme = useCallback((newTheme: ThemeType) => {
    setCurrentTheme(newTheme)
    localStorage.setItem('chat-theme', newTheme)
    
    // Если переключаем на фиолетовую тему, выходим из бизнес-режима
    if (newTheme === 'purple' && isBusinessMode) {
      setIsBusinessMode(false)
      localStorage.setItem('chat-business-mode', 'false')
    }
  }, [isBusinessMode])

  const setBusinessMode = useCallback((isBusiness: boolean) => {
    setIsBusinessMode(isBusiness)
    localStorage.setItem('chat-business-mode', isBusiness.toString())
    
    // При включении бизнес-режима автоматически переключаем на зеленую тему
    if (isBusiness && currentTheme !== 'green') {
      setCurrentTheme('green')
      localStorage.setItem('chat-theme', 'green')
    }
    
    // При выключении бизнес-режима возвращаемся к сохраненной теме
    if (!isBusiness) {
      const savedTheme = localStorage.getItem('chat-theme') as ThemeType
      if (savedTheme && savedTheme !== currentTheme) {
        setCurrentTheme(savedTheme)
      }
    }
  }, [currentTheme])

  const value = {
    theme,
    currentTheme,
    toggleTheme,
    setBusinessMode,
    isBusinessMode
  }

  return (
    <ThemeContext.Provider value={value}>
      <div
        style={{
          '--theme-transition': theme.transitions.normal,
          '--theme-primary': theme.colors.primary,
          '--theme-background': theme.colors.background,
          '--theme-surface': theme.colors.surface,
          '--theme-text-primary': theme.colors.text.primary,
          '--theme-text-secondary': theme.colors.text.secondary,
          '--theme-border': theme.colors.border,
        } as React.CSSProperties}
        className={`theme-transition ${isBusinessMode ? 'sdds-bizcom-business' : 'sdds-bizcom-standard'}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}