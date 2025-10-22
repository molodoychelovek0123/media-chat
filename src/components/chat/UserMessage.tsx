import React, { memo } from 'react';
import { Message } from '@/types/chat';
import { Theme } from '@/types/theme';

interface UserMessageProps {
  message: Message;
  theme: Theme;
}

const UserMessage: React.FC<UserMessageProps> = memo(({ message, theme }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* Аватар пользователя */}
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
          style={{
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF'
          }}
        >
          В
        </div>
        
        {/* Контейнер сообщения */}
        <div className="flex flex-col items-end">
          {/* Пузырек сообщения */}
          <div 
            className="rounded-2xl px-4 py-3 shadow-lg"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF'
            }}
          >
            {/* Содержимое сообщения будет рендериться через специализированные компоненты */}
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.type === 'text' && (
                <p>{message.content}</p>
              )}
              {message.type === 'file' && (
                <div className="flex items-center gap-2">
                  <span>📎</span>
                  <span>{message.fileName}</span>
                </div>
              )}
              {/* Для других типов сообщений будет использоваться специализированный рендер */}
            </div>
          </div>
          
          {/* Время отправки */}
          <div className="mt-1">
            <span 
              className="text-xs opacity-70"
              style={{ color: theme.colors.text.secondary }}
            >
              {message.timestamp.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

UserMessage.displayName = 'UserMessage';

export default UserMessage;