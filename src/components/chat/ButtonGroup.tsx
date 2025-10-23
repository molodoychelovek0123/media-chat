import React, { memo, useCallback, useMemo } from 'react';
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

    // Вызов действия кнопки - передаем полный объект кнопки
    if (onAction) {
      onAction(button);
    }

    // Можно добавить аналитику или логирование кликов
    console.log('Кнопка нажата:', button.label, button.action);
  }, [onAction]);

  // Мемоизация количества кнопок и текста
  const buttonsCountText = useMemo(() => {
    const count = message.buttons.length;
    return `${count} вариант${count !== 1 ? 'а' : ''} ответа`;
  }, [message.buttons.length]);

  const hasDisabledButtons = useMemo(() =>
    message.buttons.some(btn => btn.disabled),
    [message.buttons]
  );

  return (
    <div className="button-group gpu-accelerated">
      {/* Группа кнопок */}
      <div
        className={`flex gap-3 ${
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
            className={`px-6 py-4 rounded-xl text-sm font-medium scale-press hover-lift form-transition disabled:opacity-50 disabled:cursor-not-allowed ${
              message.layout === 'vertical' ? 'w-full' : ''
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
                button.variant === 'outline' ? `2px solid ${theme.colors.primary}` :
                button.variant === 'secondary' ? `2px solid ${theme.colors.border}` :
                'none',
              boxShadow: button.disabled ? 'none' : '0 6px 20px rgba(0, 0, 0, 0.15)',
              animationDelay: `${index * 50}ms`
            }}
            aria-label={button.label}
            title={button.disabled ? 'Недоступно' : button.label}
          >
            <div className="flex items-center justify-center gap-2">
              {/* Иконки для бизнес-режимов */}
              {button.label.includes('ММБ') && (
                <span className="text-base">🏢</span>
              )}
              {button.label.includes('КБ') && (
                <span className="text-base">💼</span>
              )}
              {button.label.includes('счет') && button.variant === 'primary' && (
                <span className="text-base">💳</span>
              )}
              {button.label.includes('счет') && button.variant === 'secondary' && (
                <span className="text-base">⏸️</span>
              )}
              
              {button.label}
              
              {/* Индикатор загрузки для disabled кнопок */}
              {button.disabled && (
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Информация о группе кнопок */}
      <div className="mt-3">
        <div
          className="flex items-center gap-2 text-xs px-3 py-2 rounded form-transition hover-lift"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text.secondary,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <span className="text-sm">🔘</span>
          <span className="font-medium">
            {buttonsCountText}
          </span>
          <span>•</span>
          <span>Выберите подходящий вариант</span>
        </div>
      </div>

      {/* Дополнительная информация для бизнес-режимов */}
      {message.buttons.some(btn =>
        btn.label.includes('ММБ') || btn.label.includes('КБ')
      ) && (
        <div className="mt-3">
          <div
            className="flex items-center gap-2 text-xs px-3 py-2 rounded"
            style={{
              backgroundColor: '#F0F9FF',
              color: '#0369A1',
              border: `1px solid #BAE6FD`
            }}
          >
            <span>🎯</span>
            <span>
              <strong>ММБ</strong> - Модель малого бизнеса (автоматизированный анализ)<br/>
              <strong>КБ</strong> - Консалтинг бизнеса (детальная консультация)
            </span>
          </div>
        </div>
      )}

      {/* Подсказка для пользователя */}
      {hasDisabledButtons && (
        <div className="mt-2">
          <p
            className="text-xs italic transition-opacity hover:opacity-100"
            style={{ color: theme.colors.text.secondary, opacity: 0.7 }}
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