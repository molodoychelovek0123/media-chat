import React, { memo, useMemo, Suspense } from 'react';
import { Message } from '@/types/chat';
import { Theme } from '@/types/theme';
import { LoadingFallback } from './LazyComponents';

// Ленивая загрузка компонентов сообщений
const LazyTextMessage = React.lazy(() => import('./TextMessage'));
const LazyFormMessage = React.lazy(() => import('./FormMessage'));
const LazyTableMessage = React.lazy(() => import('./TableMessage'));
const LazyImageMessage = React.lazy(() => import('./ImageMessage'));
const LazyProgressMessage = React.lazy(() => import('./ProgressMessage'));
const LazyCollapsibleReasoning = React.lazy(() => import('./CollapsibleReasoning'));
const LazyButtonGroup = React.lazy(() => import('./ButtonGroup'));
const LazyLinksGallery = React.lazy(() => import('./LinksGallery'));
const LazyMapMessage = React.lazy(() => import('./MapMessage'));

interface AgentMessageProps {
  message: Message;
  theme: Theme;
  onAction?: (action: any) => void;
}

// Компоненты для разных типов сообщений
const MessageComponents: Record<string, React.ComponentType<any>> = {
  text: LazyTextMessage,
  form: LazyFormMessage,
  table: LazyTableMessage,
  image: LazyImageMessage,
  progress: LazyProgressMessage,
  reasoning: LazyCollapsibleReasoning,
  'button-group': LazyButtonGroup,
  links: LazyLinksGallery,
  map: LazyMapMessage,
};

const AgentMessage: React.FC<AgentMessageProps> = memo(({
  message,
  theme,
  onAction
}) => {
  // Мемоизация времени для предотвращения лишних вычислений
  const formattedTime = useMemo(() => {
    return message.timestamp.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [message.timestamp]);

  // Получение соответствующего компонента для типа сообщения
  // Учитываем метаданные для определения типа отображения
  const messageType = (message as any).metadata?.messageType || message.type;
  const MessageComponent = MessageComponents[messageType] || (() => (
    <div className="text-sm text-gray-500">
      Неподдерживаемый тип сообщения: {messageType}
    </div>
  ));

  return (
    <div className="flex justify-start mb-4 gpu-accelerated">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* Аватар агента с анимацией */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium hover-lift scale-press"
          style={{
            backgroundColor: theme.colors.secondary,
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
          title="AI Консультант"
        >
          AI
        </div>
        
        {/* Контейнер сообщения */}
        <div className="flex flex-col flex-1">
          {/* Пузырек сообщения с улучшенными анимациями */}
          <div
            className="rounded-2xl px-4 py-3 shadow-lg hover-lift form-transition"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Ленивая загрузка содержимого сообщения */}
            <Suspense fallback={<LoadingFallback theme={theme} message="Загрузка сообщения..." />}>
              <MessageComponent
                message={message}
                theme={theme}
                onAction={onAction}
              />
            </Suspense>
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
      </div>
    </div>
  );
});

AgentMessage.displayName = 'AgentMessage';

export default AgentMessage;