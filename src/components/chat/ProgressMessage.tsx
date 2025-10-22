import React, { memo, useEffect, useState, useCallback } from 'react';
import { ProgressMessage as ProgressMessageType } from '@/types/chat';
import { Theme } from '@/types/theme';

interface ProgressMessageProps {
  message: ProgressMessageType;
  theme: Theme;
}

const ProgressMessage: React.FC<ProgressMessageProps> = memo(({ message, theme }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Анимация прогресса
  useEffect(() => {
    if (message.progressStatus === 'running' || message.progressStatus === 'completed') {
      setIsAnimating(true);
      
      const targetProgress = message.progress;
      const duration = 1000; // 1 секунда для анимации
      const startTime = Date.now();
      const startProgress = animatedProgress;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentProgress = startProgress + (targetProgress - startProgress) * progress;
        setAnimatedProgress(currentProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    } else if (message.progressStatus === 'idle') {
      setAnimatedProgress(0);
    }
  }, [message.progress, message.progressStatus, animatedProgress]);

  const getStatusIcon = useCallback(() => {
    switch (message.progressStatus) {
      case 'idle':
        return '⏸️';
      case 'running':
        return '🔄';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📊';
    }
  }, [message.progressStatus]);

  const getStatusText = useCallback(() => {
    switch (message.progressStatus) {
      case 'idle':
        return 'Ожидание';
      case 'running':
        return 'Выполняется';
      case 'completed':
        return 'Завершено';
      case 'error':
        return 'Ошибка';
      default:
        return 'В процессе';
    }
  }, [message.progressStatus]);

  const getProgressColor = useCallback(() => {
    switch (message.progressStatus) {
      case 'completed':
        return '#10B981'; // Зеленый для завершенных
      case 'error':
        return '#EF4444'; // Красный для ошибок
      case 'running':
        return theme.colors.primary; // Основной цвет темы
      default:
        return theme.colors.secondary; // Вторичный цвет темы
    }
  }, [message.progressStatus, theme]);

  const getProgressPercentage = useCallback(() => {
    const max = message.max || 100;
    return Math.round((animatedProgress / max) * 100);
  }, [animatedProgress, message.max]);

  const formatProgressText = useCallback(() => {
    const max = message.max || 100;
    
    if (message.showPercentage) {
      return `${getProgressPercentage()}%`;
    }
    
    return `${Math.round(animatedProgress)} / ${max}`;
  }, [animatedProgress, message.max, message.showPercentage, getProgressPercentage]);

  return (
    <div className="progress-message">
      {/* Заголовок прогресса */}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-lg">
          {getStatusIcon()}
        </div>
        <div>
          <h3 
            className="text-sm font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            {message.title}
          </h3>
          <p 
            className="text-xs"
            style={{ color: theme.colors.text.secondary }}
          >
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div className="space-y-2">
        {/* Основной прогресс-бар */}
        <div 
          className="w-full h-3 rounded-full overflow-hidden"
          style={{
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${getProgressPercentage()}%`,
              backgroundColor: getProgressColor(),
              boxShadow: isAnimating 
                ? `0 0 8px ${getProgressColor()}40` 
                : 'none'
            }}
          />
        </div>

        {/* Информация о прогрессе */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Анимация загрузки для running статуса */}
            {message.progressStatus === 'running' && (
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: getProgressColor() }}
              />
            )}
            
            <span 
              className="text-xs font-medium"
              style={{ color: theme.colors.text.primary }}
            >
              {formatProgressText()}
            </span>
          </div>

          {/* Дополнительная информация */}
          {message.description && (
            <span 
              className="text-xs"
              style={{ color: theme.colors.text.secondary }}
            >
              {message.description}
            </span>
          )}
        </div>
      </div>

      {/* Детали прогресса для сложных операций */}
      {(message.progressStatus === 'running' || message.progressStatus === 'completed') && (
        <div className="mt-3">
          <div 
            className="flex items-center gap-2 text-xs px-2 py-1 rounded"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.text.secondary
            }}
          >
            <span>⏱️</span>
            <span>
              {message.progressStatus === 'running' ? 'Выполняется...' : 'Готово!'}
            </span>
          </div>
        </div>
      )}

      {/* Сообщение об ошибке */}
      {message.progressStatus === 'error' && (
        <div className="mt-3">
          <div 
            className="flex items-center gap-2 text-xs px-3 py-2 rounded"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <span>⚠️</span>
            <span>
              {message.description || 'Произошла ошибка при выполнении операции'}
            </span>
          </div>
        </div>
      )}

      {/* Индикатор завершения */}
      {message.progressStatus === 'completed' && getProgressPercentage() === 100 && (
        <div className="mt-3">
          <div 
            className="flex items-center gap-2 text-xs px-3 py-2 rounded animate-pulse"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <span>🎉</span>
            <span>Операция успешно завершена!</span>
          </div>
        </div>
      )}

      {/* Стили для анимации пульсации */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
});

ProgressMessage.displayName = 'ProgressMessage';

export default ProgressMessage;