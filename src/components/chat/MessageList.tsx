import React, { memo, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChat } from '@/hooks/useChat'
import { Message } from '@/types/chat'

// Импорт всех компонентов сообщений
import UserMessage from './UserMessage'
import AgentMessage from './AgentMessage'
import TextMessage from './TextMessage'
import CollapsibleReasoning from './CollapsibleReasoning'
import FormMessage from './FormMessage'
import ImageMessage from './ImageMessage'
import LinksGallery from './LinksGallery'
import TableMessage from './TableMessage'
import MapMessage from './MapMessage'
import ProgressMessage from './ProgressMessage'
import ButtonGroup from './ButtonGroup'
import QuickReplies from './QuickReplies'

// Компонент для отображения содержимого сообщения
const MessageContent: React.FC<{ message: Message; theme: any; onAction?: (action: any) => void }> = ({
  message,
  theme,
  onAction
}) => {
  switch (message.type) {
    case 'text':
      return <TextMessage message={message} theme={theme} />
    
    case 'file':
      // Используем существующий FileMessageBubble или создаем новый
      const handleDownload = () => {
        const link = document.createElement('a')
        link.href = message.fileUrl
        link.download = message.fileName
        link.click()
      }

      const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
      }

      return (
        <div className="message-content">
          <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`
            }}
            onClick={handleDownload}
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <span className="text-white text-xs font-medium">FILE</span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: theme.colors.text.primary }}
              >
                {message.fileName}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: theme.colors.text.secondary }}
              >
                {formatFileSize(message.fileSize)} • {message.mimeType}
              </p>
            </div>
          </div>
        </div>
      )
    
    case 'reasoning':
      return <CollapsibleReasoning message={message} theme={theme} />
    
    case 'form':
      return <FormMessage message={message} theme={theme} onAction={onAction} />
    
    case 'image':
      return <ImageMessage message={message} theme={theme} />
    
    case 'links':
      return <LinksGallery message={message} theme={theme} />
    
    case 'table':
      return <TableMessage message={message} theme={theme} />
    
    case 'map':
      return <MapMessage message={message} theme={theme} />
    
    case 'progress':
      return <ProgressMessage message={message} theme={theme} />
    
    case 'button-group':
      return <ButtonGroup message={message} theme={theme} onAction={onAction} />
    
    case 'quick-replies':
      return <QuickReplies message={message} theme={theme} onAction={onAction} />
    
    default:
      return (
        <div className="message-content">
          <p className="text-sm text-red-500">
            Неизвестный тип сообщения: {message.type}
          </p>
        </div>
      )
  }
}

// Основной компонент MessageList
const MessageList: React.FC = memo(() => {
  const { theme } = useTheme()
  const { messages, isTyping } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Автоматическая прокрутка к последнему сообщению
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Обработчик для отображения разных типов сообщений
  const renderMessage = useCallback((message: Message) => {
    const handleAction = (action: any) => {
      // Обработка действий от компонентов (кнопки, формы, быстрые ответы)
      console.log('Action received:', action)
      // Здесь можно добавить логику обработки действий
    }

    // Используем разные компоненты для пользователя и агента
    if (message.sender === 'user') {
      return (
        <UserMessage
          key={message.id}
          message={message}
          theme={theme}
        />
      )
    } else {
      return (
        <AgentMessage
          key={message.id}
          message={message}
          theme={theme}
          onAction={handleAction}
        />
      )
    }
  }, [theme])

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto p-6"
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
          {messages.map(renderMessage)}
          
          {/* Индикатор печатающего агента */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div
                className="max-w-[70%] rounded-2xl p-4 rounded-bl-md"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  </div>
                  <span className="text-sm">Агент печатает...</span>
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