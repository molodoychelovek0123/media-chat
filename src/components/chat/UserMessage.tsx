import React, { memo, useMemo } from 'react';
import { Message } from '@/types/chat';
import { Theme } from '@/types/theme';

interface UserMessageProps {
  message: Message;
  theme: Theme;
}

const UserMessage: React.FC<UserMessageProps> = memo(({ message, theme }) => {
  // Мемоизация времени для предотвращения лишних вычислений
  const formattedTime = useMemo(() => {
    return message.timestamp.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [message.timestamp]);

  return (
    <div className="flex justify-end mb-4 gpu-accelerated">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* Контейнер сообщения */}
        <div className="flex flex-col items-end flex-1">
          {/* Пузырек сообщения с улучшенными анимациями */}
          <div
            className="rounded-2xl px-4 py-3 shadow-lg hover-lift form-transition"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            {/* Содержимое сообщения будет рендериться через специализированные компоненты */}
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.type === 'text' && (
                <p className="leading-relaxed">{message.content}</p>
              )}
              {message.type === 'file' && (
                <div className="flex items-center gap-2">
                  <span className="text-base">📎</span>
                  <span className="font-medium">{message.fileName}</span>
                </div>
              )}
              {/* Для других типов сообщений будет использоваться специализированный рендер */}
            </div>
          </div>
          
          {/* Время отправки */}
          <div className="mt-1">
            <span
              className="text-xs opacity-70 transition-opacity hover:opacity-100"
              style={{ color: theme.colors.text.secondary }}
            >
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Аватар пользователя с анимацией */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium hover-lift scale-press"
          style={{
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
          title="Вы"
        >
          В
        </div>
      </div>
    </div>
  );
});

UserMessage.displayName = 'UserMessage';

export default UserMessage;