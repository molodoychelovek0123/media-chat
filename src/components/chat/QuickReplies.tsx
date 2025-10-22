import React, { memo, useCallback, useState } from 'react';
import { QuickRepliesMessage } from '@/types/chat';
import { Theme } from '@/types/theme';

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
    <div className="quick-replies">
      {/* Заголовок быстрых ответов */}
      <div className="mb-3">
        <p 
          className="text-sm font-medium mb-2"
          style={{ color: theme.colors.text.primary }}
        >
          Быстрые ответы:
        </p>
      </div>

      {/* Список предложений */}
      <div className="space-y-2">
        {visibleSuggestions().map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={selectedSuggestion === suggestion}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 ${
              selectedSuggestion === suggestion 
                ? 'scale-95' 
                : 'hover:scale-105 active:scale-95'
            }`}
            style={{
              backgroundColor: 
                selectedSuggestion === suggestion 
                  ? theme.colors.primary 
                  : theme.colors.surface,
              color: 
                selectedSuggestion === suggestion 
                  ? '#FFFFFF' 
                  : theme.colors.text.primary,
              border: `1px solid ${
                selectedSuggestion === suggestion 
                  ? theme.colors.primary 
                  : theme.colors.border
              }`,
              boxShadow: selectedSuggestion === suggestion 
                ? `0 4px 8px ${theme.colors.primary}40` 
                : '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            aria-label={`Быстрый ответ: ${suggestion}`}
          >
            <div className="flex items-center justify-between">
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
          </button>
        ))}
      </div>

      {/* Кнопка "Показать еще" */}
      {hasMoreSuggestions && (
        <div className="mt-3 text-center">
          <button
            onClick={toggleShowAll}
            className="text-xs px-3 py-1 rounded-full transition-colors hover:opacity-80"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.text.secondary,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            {showAll ? 'Скрыть' : `Показать еще ${message.suggestions.length - (message.maxVisible || 3)}`}
          </button>
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
          className="text-xs italic"
          style={{ color: theme.colors.text.secondary }}
        >
          💡 Эти предложения помогут продолжить диалог
        </p>
      </div>

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