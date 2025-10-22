import React, { memo, useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAgent } from '@/hooks/useAgent'

const AgentStatus: React.FC = memo(() => {
  const { theme } = useTheme()
  const { isAgentTyping } = useAgent()
  const [isVisible, setIsVisible] = useState(false)
  const [dots, setDots] = useState('')

  // Анимация появления/исчезновения
  useEffect(() => {
    if (isAgentTyping) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isAgentTyping])

  // Анимация точек
  useEffect(() => {
    if (!isAgentTyping) {
      setDots('')
      return
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isAgentTyping])

  if (!isVisible) return null

  return (
    <div 
      className={`px-6 py-3 border-t transition-all duration-300 ${
        isAgentTyping ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        color: theme.colors.text.secondary
      }}
    >
      <div className="flex items-center gap-3">
        {/* Аватар агента */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF'
          }}
        >
          <span className="text-sm font-medium">AI</span>
        </div>

        {/* Индикатор печатания */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isAgentTyping ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isAgentTyping ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{ 
                  backgroundColor: theme.colors.primary,
                  animationDelay: '150ms'
                }}
              />
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isAgentTyping ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{ 
                  backgroundColor: theme.colors.primary,
                  animationDelay: '300ms'
                }}
              />
            </div>
            <span className="text-sm font-medium">
              BCP AI Консультант{dots}
            </span>
          </div>
          
          {/* Дополнительная информация */}
          <p className="text-xs mt-1 opacity-70">
            Обрабатываю ваш запрос...
          </p>
        </div>

        {/* Индикатор статуса */}
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: isAgentTyping ? theme.colors.accent : theme.colors.text.disabled
            }}
          />
          <span className="text-xs">
            {isAgentTyping ? 'Активен' : 'Неактивен'}
          </span>
        </div>
      </div>

      {/* Прогресс-бар (опционально) */}
      {isAgentTyping && (
        <div 
          className="w-full h-1 rounded-full mt-2 overflow-hidden"
          style={{
            backgroundColor: theme.colors.background
          }}
        >
          <div 
            className="h-full rounded-full animate-pulse"
            style={{
              backgroundColor: theme.colors.primary,
              width: '60%',
              animation: 'pulse 2s infinite'
            }}
          />
        </div>
      )}
    </div>
  )
})

AgentStatus.displayName = 'AgentStatus'

export default AgentStatus