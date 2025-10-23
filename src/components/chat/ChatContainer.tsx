import React, { memo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChat } from '@/hooks/useChat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import AgentStatus from './AgentStatus'

const ChatContainer: React.FC = memo(() => {
  const { theme } = useTheme()
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

      {/* Main Chat Area */}
      <div className="sdds-chat-main flex-1 flex flex-col">
        {/* Messages Container */}
        <div
          className="sdds-chat-messages flex-1 overflow-y-auto theme-transition"
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