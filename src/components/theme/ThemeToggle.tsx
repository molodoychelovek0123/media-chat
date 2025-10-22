import React from 'react'
import { useTheme } from '@contexts/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme()

  const handleToggle = () => {
    const newTheme = currentTheme === 'purple' ? 'green' : 'purple'
    toggleTheme(newTheme)
  }

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
      style={{
        backgroundColor: 'transparent',
        border: `1px solid ${currentTheme === 'purple' ? '#8B5CF6' : '#10B981'}`,
        color: currentTheme === 'purple' ? '#8B5CF6' : '#10B981'
      }}
      aria-label={`Переключить тему на ${currentTheme === 'purple' ? 'зеленую' : 'фиолетовую'}`}
    >
      <span className="text-sm font-medium">
        {currentTheme === 'purple' ? 'Фиолетовая' : 'Зеленая'}
      </span>
      <div 
        className="w-4 h-4 rounded-full"
        style={{
          backgroundColor: currentTheme === 'purple' ? '#8B5CF6' : '#10B981'
        }}
      />
    </button>
  )
}

export default ThemeToggle