import React from 'react'
import { useTheme } from '@contexts/ThemeContext'
import { Button } from '@/components/sdds-imports'

const ThemeToggle: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme()

  const handleToggle = () => {
    const newTheme = currentTheme === 'purple' ? 'green' : 'purple'
    toggleTheme(newTheme)
  }

  return (
    <Button
      onClick={handleToggle}
      view="secondary"
      size="s"
      aria-label={`Переключить тему на ${currentTheme === 'purple' ? 'зеленую' : 'фиолетовую'}`}
    >
      {currentTheme === 'purple' ? '🌙 Фиолетовая' : '☀️ Зеленая'}
    </Button>
  )
}

export default ThemeToggle