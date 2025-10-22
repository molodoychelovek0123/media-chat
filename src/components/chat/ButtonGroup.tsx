import React, { memo, useCallback } from 'react';
import { ButtonGroupMessage, ButtonItem } from '@/types/chat';
import { Theme } from '@/types/theme';

interface ButtonGroupProps {
  message: ButtonGroupMessage;
  theme: Theme;
  onAction?: (action: any) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = memo(({ 
  message, 
  theme, 
  onAction 
}) => {
  const handleButtonClick = useCallback((button: ButtonItem) => {
    if (button.disabled) return;

    // Вызов действия кнопки
    if (onAction) {
      onAction(button.action);
    }

    // Можно добавить аналитику или логирование кликов
    console.log('Кнопка нажата:', button.label, button.action);
  }, [onAction]);

  const getButtonStyles = useCallback((button: ButtonItem) => {
    const baseStyles = {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
      cursor: button.disabled ? 'not-allowed' : 'pointer',
      opacity: button.disabled ? 0.5 : 1,
      border: 'none',
      outline: 'none'
    };

    switch (button.variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary,
          color: '#FFFFFF',
          ':hover': button.disabled ? {} : {
            backgroundColor: theme.colors.secondary,
            transform: 'translateY(-1px)'
          }
        };
      
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          border: `1px solid ${theme.colors.border}`,
          ':hover': button.disabled ? {} : {
            backgroundColor: theme.colors.background,
            transform: 'translateY(-1px)'
          }
        };
      
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          border: `1px solid ${theme.colors.primary}`,
          ':hover': button.disabled ? {} : {
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
            transform: 'translateY(-1px)'
          }
        };
      
      default:
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary,
          color: '#FFFFFF',
          ':hover': button.disabled ? {} : {
            backgroundColor: theme.colors.secondary,
            transform: 'translateY(-1px)'
          }
        };
    }
  }, [theme]);

  return (
    <div className="button-group">
      {/* Группа кнопок */}
      <div 
        className={`flex gap-2 ${
          message.layout === 'vertical' 
            ? 'flex-col' 
            : 'flex-row flex-wrap'
        }`}
      >
        {message.buttons.map((button, index) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button)}
            disabled={button.disabled}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              message.layout === 'vertical' ? 'w-full' : ''
            } ${
              button.disabled 
                ? '' 
                : 'hover:scale-105 active:scale-95'
            }`}
            style={{
              backgroundColor: 
                button.variant === 'primary' ? theme.colors.primary :
                button.variant === 'secondary' ? theme.colors.surface :
                button.variant === 'outline' ? 'transparent' : theme.colors.primary,
              color: 
                button.variant === 'outline' ? theme.colors.primary :
                button.variant === 'secondary' ? theme.colors.text.primary :
                '#FFFFFF',
              border: 
                button.variant === 'outline' ? `1px solid ${theme.colors.primary}` :
                button.variant === 'secondary' ? `1px solid ${theme.colors.border}` :
                'none',
              boxShadow: button.disabled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            aria-label={button.label}
            title={button.disabled ? 'Недоступно' : button.label}
          >
            {button.label}
            
            {/* Индикатор загрузки для disabled кнопок */}
            {button.disabled && (
              <span className="ml-2">⏳</span>
            )}
          </button>
        ))}
      </div>

      {/* Информация о группе кнопок */}
      <div className="mt-2">
        <div 
          className="flex items-center gap-2 text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text.secondary
          }}
        >
          <span>🔘</span>
          <span>
            {message.buttons.length} вариант{message.buttons.length !== 1 ? 'а' : ''} ответа
          </span>
          <span>•</span>
          <span>Выберите подходящий вариант</span>
        </div>
      </div>

      {/* Подсказка для пользователя */}
      {message.buttons.some(btn => btn.disabled) && (
        <div className="mt-2">
          <p 
            className="text-xs italic"
            style={{ color: theme.colors.text.secondary }}
          >
            ⏳ Некоторые варианты временно недоступны
          </p>
        </div>
      )}
    </div>
  );
});

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;