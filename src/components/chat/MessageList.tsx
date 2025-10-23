import React, { memo, useEffect, useRef, useCallback, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChat } from '@/hooks/useChat'
import { Message } from '@/types/chat'

// Импорт всех компонентов сообщений
import UserMessage from './UserMessage'
import AgentMessage from './AgentMessage'


// Основной компонент MessageList
const MessageList: React.FC = memo(() => {
  const { theme } = useTheme()
  const { messages, isTyping, handleAgentAction } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(new Set())

  // Автоматическая прокрутка к последнему сообщению
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Добавляем новые сообщения в видимые с анимацией
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && !visibleMessages.has(lastMessage.id)) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => new Set([...prev, lastMessage.id]))
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [messages, visibleMessages])

  // Обработчик для отображения разных типов сообщений
  const renderMessage = useCallback((message: Message, index: number) => {
    const handleAction = (action: any) => {
      // Обработка действий от компонентов (кнопки, формы, быстрые ответы)
      console.log('Action received:', action)
      // Передаем действие в контекст чата для обработки
      if (handleAgentAction) {
        handleAgentAction(action)
      }
    }

    const isVisible = visibleMessages.has(message.id)
    const animationDelay = Math.min(index * 100, 500) // Максимальная задержка 500ms

    // Используем разные компоненты для пользователя и агента
    if (message.sender === 'user') {
      return (
        <div
          key={message.id}
          className={`message-fade-in user-message ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            animationDelay: `${animationDelay}ms`,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          <UserMessage
            message={message}
            theme={theme}
          />
        </div>
      )
    } else {
      return (
        <div
          key={message.id}
          className={`message-fade-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            animationDelay: `${animationDelay}ms`,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          <AgentMessage
            message={message}
            theme={theme}
            onAction={handleAction}
          />
        </div>
      )
    }
  }, [theme, visibleMessages, handleAgentAction])

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-6 scroll-smooth"
      style={{
        backgroundColor: theme.colors.background
      }}
    >
      {messages.length === 0 ? (
        <div
          className="flex items-center justify-center h-full text-center"
          style={{ color: theme.colors.text.secondary }}
        >
          <div className="max-w-md">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <span className="text-white text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Добро пожаловать в BCP AI Консультант
            </h3>
            <p className="text-sm leading-relaxed">
              Я помогу вам с вопросами открытия бизнеса. Начните диалог, чтобы получить
              пошаговую консультацию по всем этапам создания вашего дела.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message, index) => renderMessage(message, index))}

          {/* Индикатор печатающего агента */}
          {isTyping && (
            <div className="flex justify-start mb-4 message-fade-in">
              <div
                className="max-w-[70%] rounded-2xl p-4 rounded-bl-md hover-lift"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full typing-bounce"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-2 h-2 rounded-full typing-bounce"
                      style={{
                        backgroundColor: theme.colors.primary,
                        animationDelay: '200ms'
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full typing-bounce"
                      style={{
                        backgroundColor: theme.colors.primary,
                        animationDelay: '400ms'
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">Агент печатает...</span>
                </div>
                <div className="mt-2 text-xs opacity-70">
                  Обрабатываю ваш запрос
                </div>
              </div>
            </div>
          )}

          {/* Элемент для автоматической прокрутки */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
})

MessageList.displayName = 'MessageList'

export default MessageList