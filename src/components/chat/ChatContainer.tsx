import React, { memo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChat } from '@/hooks/useChat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import AgentStatus from './AgentStatus'

const ChatContainer: React.FC = memo(() => {
  const { theme, currentTheme, isBusinessMode } = useTheme()
  const { isLoading } = useChat()

  return (
    <div
      className="sdds-chat-container flex flex-col h-screen w-full theme-transition"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary,
        transition: 'background-color var(--theme-transition), color var(--theme-transition)'
      }}
    >
      {/* Header Area */}
      <div
        className="sdds-chat-header px-6 py-4 border-b theme-transition"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          transition: 'background-color var(--theme-transition), border-color var(--theme-transition)'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="sdds-heading-1 text-xl font-semibold theme-transition" style={{
              color: theme.colors.text.primary,
              transition: 'color var(--theme-transition)'
            }}>
              BCP AI Консультант
            </h1>
            <p className="sdds-paragraph text-sm mt-1 theme-transition" style={{
              color: theme.colors.text.secondary,
              transition: 'color var(--theme-transition)'
            }}>
              {isBusinessMode ? 'Бизнес-режим' : 'Стандартный режим'} • {currentTheme === 'purple' ? 'Фиолетовая тема' : 'Зеленая тема'}
            </p>
          </div>
          {isBusinessMode && (
            <div
              className="sdds-badge sdds-badge--success px-3 py-1 rounded-full text-xs font-medium theme-transition"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.text.inverse,
                transition: 'background-color var(--theme-transition), color var(--theme-transition)'
              }}
            >
              Бизнес-режим
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="sdds-chat-main flex-1 flex flex-col overflow-hidden">
        {/* Messages Container */}
        <div
          className="sdds-chat-messages flex-1 overflow-hidden theme-transition"
          style={{
            backgroundColor: theme.colors.background,
            transition: 'background-color var(--theme-transition)'
          }}
        >
          <MessageList />
        </div>

        {/* Agent Typing Indicator */}
        <AgentStatus />

        {/* Message Input Area */}
        <div
          className="sdds-chat-input-area border-t theme-transition"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            transition: 'background-color var(--theme-transition), border-color var(--theme-transition)'
          }}
        >
          <MessageInput />
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div
          className="sdds-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 theme-transition"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            transition: 'background-color var(--theme-transition)'
          }}
        >
          <div
            className="sdds-card rounded-lg p-6 text-center theme-transition"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              transition: 'background-color var(--theme-transition), color var(--theme-transition)'
            }}
          >
            <div
              className="sdds-spinner animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-3 theme-transition"
              style={{
                borderColor: theme.colors.primary,
                transition: 'border-color var(--theme-transition)'
              }}
            />
            <p className="sdds-paragraph text-sm">Обработка запроса...</p>
          </div>
        </div>
      )}
    </div>
  )
})

ChatContainer.displayName = 'ChatContainer'

export default ChatContainer