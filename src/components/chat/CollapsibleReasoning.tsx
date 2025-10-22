import React, { memo, useState, useCallback, useMemo } from 'react';
import { ReasoningMessage } from '@/types/chat';
import { Theme } from '@/types/theme';

interface CollapsibleReasoningProps {
  message: ReasoningMessage;
  theme: Theme;
}

const CollapsibleReasoning: React.FC<CollapsibleReasoningProps> = memo(({
  message,
  theme
}) => {
  const [isCollapsed, setIsCollapsed] = useState(message.isCollapsed ?? true);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsAnimating(true);
    setIsCollapsed(prev => !prev);
    // Сбрасываем состояние анимации после завершения
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const formatTimestamp = useCallback((timestamp: Date) => {
    return timestamp.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  // Мемоизация количества шагов для предотвращения лишних вычислений
  const stepsCountText = useMemo(() => {
    const count = message.steps.length;
    return `${count} шаг${count !== 1 ? 'а' : ''}`;
  }, [message.steps.length]);

  return (
    <div className="collapsible-reasoning gpu-accelerated">
      {/* Заголовок цепочки рассуждений */}
      <div
        className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover-lift scale-press"
        style={{
          backgroundColor: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: isAnimating ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        onClick={toggleCollapse}
        role="button"
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? 'Развернуть цепочку рассуждений' : 'Свернуть цепочку рассуждений'}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs hover-lift"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF'
            }}
          >
            🧠
          </div>
          <div>
            <h3
              className="text-sm font-medium"
              style={{ color: theme.colors.text.primary }}
            >
              Цепочка рассуждений
            </h3>
            <p
              className="text-xs"
              style={{ color: theme.colors.text.secondary }}
            >
              {stepsCountText}
            </p>
          </div>
        </div>
        
        <div
          className={`transform collapse-transition ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: theme.colors.text.secondary }}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Содержимое цепочки рассуждений с плавной анимацией */}
      <div
        className={`collapse-transition ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
        }`}
        style={{
          overflow: 'hidden'
        }}
      >
        {!isCollapsed && (
          <div
            className="mt-2 p-3 rounded-lg space-y-3 overflow-y-auto"
            style={{
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            {message.steps.map((step, index) => (
              <div
                key={step.id}
                className="flex gap-3 p-3 rounded-lg hover-lift form-transition"
                style={{
                  backgroundColor: theme.colors.surface,
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Номер шага */}
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium hover-lift"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: '#FFFFFF'
                  }}
                >
                  {index + 1}
                </div>
                
                {/* Содержимое шага */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {step.content}
                  </p>
                  
                  {/* Время шага */}
                  <div className="mt-2">
                    <span
                      className="text-xs opacity-70 transition-opacity hover:opacity-100"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      {formatTimestamp(step.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Подсказка для пользователя */}
      {isCollapsed && message.steps.length > 0 && (
        <div className="mt-2">
          <p
            className="text-xs italic transition-opacity hover:opacity-100"
            style={{ color: theme.colors.text.secondary, opacity: 0.7 }}
          >
            Нажмите, чтобы увидеть процесс мышления агента
          </p>
        </div>
      )}
    </div>
  );
});

CollapsibleReasoning.displayName = 'CollapsibleReasoning';

export default CollapsibleReasoning;