import React, { memo, useEffect, useState, useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChat } from '@/hooks/useChat'

const AgentStatus: React.FC = memo(() => {
  const { theme } = useTheme()
  const { isTyping } = useChat()
  const [isVisible, setIsVisible] = useState(false)
  const [dots, setDots] = useState('')
  const [bounceIndex, setBounceIndex] = useState(0)

  // Анимация появления/исчезновения
  useEffect(() => {
    if (isTyping) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isTyping])

  // Анимация точек с bounce эффектом
  useEffect(() => {
    if (!isTyping) {
      setDots('')
      setBounceIndex(0)
      return
    }

    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    const bounceInterval = setInterval(() => {
      setBounceIndex(prev => (prev + 1) % 3)
    }, 300)

    return () => {
      clearInterval(dotsInterval)
      clearInterval(bounceInterval)
    }
  }, [isTyping])

  // Мемоизация текста статуса
  const statusText = useMemo(() => {
    return `BCP AI Консультант${dots}`
  }, [dots])

  if (!isVisible) return null

  return (
    <div
      className={`px-6 py-4 border-t form-transition gpu-accelerated ${
        isTyping ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        color: theme.colors.text.secondary,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex items-center gap-4">
        {/* Аватар агента с анимацией */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 hover-lift scale-press"
          style={{
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
          title="AI Консультант"
        >
          <span className="text-sm font-bold">AI</span>
        </div>

        {/* Индикатор печатания */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {/* Анимированные точки с bounce эффектом */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full form-transition ${
                    isTyping ? 'typing-bounce' : 'opacity-30'
                  }`}
                  style={{
                    backgroundColor: theme.colors.primary,
                    animationDelay: `${index * 150}ms`,
                    transform: bounceIndex === index ? 'scale(1.4)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">
              {statusText}
            </span>
          </div>
          
          {/* Дополнительная информация */}
          <p className="text-xs mt-2 opacity-70 transition-opacity hover:opacity-100">
            Обрабатываю ваш запрос...
          </p>
        </div>

        {/* Индикатор статуса */}
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full form-transition"
            style={{
              backgroundColor: isTyping ? theme.colors.accent : theme.colors.text.disabled,
              boxShadow: isTyping ? `0 0 8px ${theme.colors.accent}40` : 'none'
            }}
          />
          <span className="text-xs font-medium">
            {isTyping ? 'Активен' : 'Неактивен'}
          </span>
        </div>
      </div>

      {/* Анимированный прогресс-бар */}
      {isTyping && (
        <div className="mt-3">
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{
              backgroundColor: theme.colors.background
            }}
          >
            <div
              className="h-full rounded-full form-transition"
              style={{
                backgroundColor: theme.colors.primary,
                width: '60%',
                animation: 'pulse 2s infinite, progressSlide 3s ease-in-out infinite'
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span
              className="text-xs"
              style={{ color: theme.colors.text.secondary }}
            >
              Анализ запроса...
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: theme.colors.primary }}
            >
              60%
            </span>
          </div>
        </div>
      )}

      {/* Стили для анимации прогресс-бара */}
      <style>{`
        @keyframes progressSlide {
          0%, 100% { transform: translateX(-10%); }
          50% { transform: translateX(10%); }
        }
      `}</style>
    </div>
  )
})

AgentStatus.displayName = 'AgentStatus'

export default AgentStatus