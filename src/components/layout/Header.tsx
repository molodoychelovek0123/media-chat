import React from 'react'
import { useTheme } from '@contexts/ThemeContext'
import ThemeToggle from '../theme/ThemeToggle'

const Header: React.FC = () => {
  const { theme } = useTheme()

  return (
    <header 
      className="flex justify-between items-center fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: theme.colors.surface,
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: theme.spacing.md,
        height: '60px'
      }}
    >
      <div className="flex items-center">
        <h1 
          className="text-xl font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          BCP AI Консультант
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header