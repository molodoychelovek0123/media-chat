import React, { memo, useCallback, useState } from 'react';
import { QuickRepliesMessage } from '@/types/chat';
import { Theme } from '@/types/theme';
import { Button } from '@/components/sdds-imports';

interface QuickRepliesProps {
  message: QuickRepliesMessage;
  theme: Theme;
  onAction?: (suggestion: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = memo(({ 
  message, 
  theme, 
  onAction 
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSelectedSuggestion(suggestion);
    
    // Вызов действия с задержкой для визуальной обратной связи
    setTimeout(() => {
      if (onAction) {
        onAction(suggestion);
      }
      setSelectedSuggestion(null);
    }, 300);
  }, [onAction]);

  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  // Определяем, какие предложения показывать
  const visibleSuggestions = useCallback(() => {
    const maxVisible = message.maxVisible || 3;
    
    if (showAll || message.suggestions.length <= maxVisible) {
      return message.suggestions;
    }
    
    return message.suggestions.slice(0, maxVisible);
  }, [message.suggestions, message.maxVisible, showAll]);

  const hasMoreSuggestions = message.suggestions.length > (message.maxVisible || 3);

  return (
    <div className="quick-replies gpu-accelerated">
      {/* Заголовок быстрых ответов */}
      <div className="mb-3">
        <p
          className="text-sm font-medium mb-2 hover-lift"
          style={{ color: theme.colors.text.primary }}
        >
          Быстрые ответы:
        </p>
      </div>

      {/* Список предложений */}
      <div className="space-y-2">
        {visibleSuggestions().map((suggestion, index) => (
          <Button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={selectedSuggestion === suggestion}
            view={selectedSuggestion === suggestion ? 'default' : 'secondary'}
            size="l"
            stretch
            style={{
              textAlign: 'left',
              justifyContent: 'flex-start'
            }}
            aria-label={`Быстрый ответ: ${suggestion}`}
          >
            <div className="flex items-center justify-between w-full">
              <span>{suggestion}</span>
              
              {/* Индикатор выбора */}
              {selectedSuggestion === suggestion && (
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: '#FFFFFF' }}
                  />
                  <span className="text-xs">Отправка...</span>
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>

      {/* Кнопка "Показать еще" */}
      {hasMoreSuggestions && (
        <div className="mt-3 text-center">
          <Button
            onClick={toggleShowAll}
            view="clear"
            size="s"
          >
            {showAll ? 'Скрыть' : `Показать еще ${message.suggestions.length - (message.maxVisible || 3)}`}
          </Button>
        </div>
      )}

      {/* Информация о быстрых ответах */}
      <div className="mt-3">
        <div 
          className="flex items-center gap-2 text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text.secondary
          }}
        >
          <span>💬</span>
          <span>
            {message.suggestions.length} быстр{message.suggestions.length === 1 ? 'ый' : 'ых'} ответ{message.suggestions.length !== 1 ? 'а' : ''}
          </span>
          <span>•</span>
          <span>Нажмите для отправки</span>
        </div>
      </div>

      {/* Подсказка для пользователя */}
      <div className="mt-2">
        <p
          className="text-xs italic transition-opacity hover:opacity-100"
          style={{ color: theme.colors.text.secondary, opacity: 0.7 }}
        >
          💡 Эти предложения помогут продолжить диалог
        </p>
      </div>

      {/* Дополнительная информация для бизнес-сценария */}
      {message.suggestions.some(suggestion =>
        suggestion.toLowerCase().includes('финанс') ||
        suggestion.toLowerCase().includes('анализ') ||
        suggestion.toLowerCase().includes('риск')
      ) && (
        <div className="mt-2">
          <div
            className="flex items-center gap-2 text-xs px-2 py-1 rounded"
            style={{
              backgroundColor: '#F0F9FF',
              color: '#0369A1',
              border: `1px solid #BAE6FD`
            }}
          >
            <span>🎯</span>
            <span>
              Выберите тип анализа для детального изучения вашего проекта
            </span>
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
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
});

QuickReplies.displayName = 'QuickReplies';

export default QuickReplies;