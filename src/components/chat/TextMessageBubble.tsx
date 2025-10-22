import React, { memo } from 'react'
import { TextMessage } from '@/types/chat'
import { Theme } from '@/types/theme'

interface TextMessageBubbleProps {
  message: TextMessage
  theme: Theme
  sender: 'user' | 'agent'
}

const TextMessageBubble: React.FC<TextMessageBubbleProps> = memo(({ 
  message, 
  theme, 
  sender 
}) => {
  return (
    <div className="message-content">
      <p className="text-sm whitespace-pre-wrap leading-relaxed">
        {message.content}
      </p>
      
      {/* Поддержка markdown форматирования (базовая) */}
      {message.format === 'markdown' && (
        <style>{`
          .message-content strong { font-weight: 600; }
          .message-content em { font-style: italic; }
          .message-content code { 
            background: rgba(255,255,255,0.1); 
            padding: 0.1rem 0.3rem; 
            border-radius: 0.25rem; 
            font-family: monospace; 
          }
        `}</style>
      )}
    </div>
  )
})

TextMessageBubble.displayName = 'TextMessageBubble'

export default TextMessageBubble