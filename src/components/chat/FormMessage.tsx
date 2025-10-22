import React, { memo, useState, useCallback, useMemo } from 'react';
import { FormMessage as FormMessageType, FormField } from '@/types/chat';
import { Theme } from '@/types/theme';

interface FormMessageProps {
  message: FormMessageType;
  theme: Theme;
  onAction?: (action: any) => void;
}

const FormMessage: React.FC<FormMessageProps> = memo(({
  message,
  theme,
  onAction
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Отметить поле как затронутое
    setTouchedFields(prev => new Set([...prev, fieldId]));
    
    // Очистить ошибку при изменении поля
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  }, [errors]);

  // Мемоизация валидации полей
  const validateField = useCallback((field: FormField, value: any): string => {
    if (field.required && (!value || value === '')) {
      return 'Это поле обязательно для заполнения';
    }

    if (field.validation) {
      if (field.validation.pattern && value && !field.validation.pattern.test(value)) {
        return 'Неверный формат';
      }

      if (field.validation.min !== undefined && value < field.validation.min) {
        return `Минимальное значение: ${field.validation.min}`;
      }

      if (field.validation.max !== undefined && value > field.validation.max) {
        return `Максимальное значение: ${field.validation.max}`;
      }
    }

    return '';
  }, []);

  // Мемоизация общего количества полей
  const totalFields = useMemo(() => message.fields.length, [message.fields]);
  const filledFields = useMemo(() =>
    message.fields.filter(field => formData[field.id] && formData[field.id] !== '').length,
    [message.fields, formData]
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Отметить все поля как затронутые для показа всех ошибок
    const allFieldIds = message.fields.map(field => field.id);
    setTouchedFields(prev => new Set([...prev, ...allFieldIds]));
    
    // Валидация всех полей
    const newErrors: Record<string, string> = {};
    let isValid = true;

    message.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      // Анимация встряски для невалидной формы
      const formElement = e.currentTarget as HTMLFormElement;
      formElement.classList.add('shake-animation');
      setTimeout(() => formElement.classList.remove('shake-animation'), 600);
      return;
    }

    setIsSubmitting(true);

    try {
      if (message.onSubmit) {
        await message.onSubmit(formData);
      }
      
      if (onAction) {
        onAction({
          type: 'form-submit',
          payload: formData
        });
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, message.fields, message.onSubmit, onAction, validateField]);

  const renderField = useCallback((field: FormField, index: number) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];
    const isTouched = touchedFields.has(field.id);
    const showError = isTouched && error;

    const commonProps = {
      id: field.id,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleFieldChange(field.id, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      className: `w-full px-3 py-2 rounded-lg border text-sm form-transition ${
        showError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500 shake-animation'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
      } hover-lift`,
      style: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary,
        borderColor: showError ? '#EF4444' : theme.colors.border,
        animationDelay: `${index * 50}ms`
      }
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            {...commonProps}
            type={field.type}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Выберите вариант</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border
              }}
            />
            <label 
              htmlFor={field.id}
              className="text-sm"
              style={{ color: theme.colors.text.primary }}
            >
              {field.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  }, [formData, errors, theme, handleFieldChange]);

  return (
    <div className="form-message gpu-accelerated">
      {/* Заголовок формы */}
      {message.title && (
        <h3
          className="text-lg font-semibold mb-4 hover-lift"
          style={{ color: theme.colors.text.primary }}
        >
          {message.title}
        </h3>
      )}

      {/* Прогресс заполнения формы */}
      {totalFields > 1 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span
              className="text-xs font-medium"
              style={{ color: theme.colors.text.secondary }}
            >
              Прогресс заполнения
            </span>
            <span
              className="text-xs"
              style={{ color: theme.colors.text.secondary }}
            >
              {filledFields} из {totalFields}
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: theme.colors.background }}
          >
            <div
              className="h-full rounded-full form-transition"
              style={{
                backgroundColor: theme.colors.primary,
                width: `${(filledFields / totalFields) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {message.fields.map((field, index) => {
          const error = errors[field.id];
          const isTouched = touchedFields.has(field.id);
          const showError = isTouched && error;

          return (
            <div
              key={field.id}
              className="space-y-2 form-transition"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {field.type !== 'checkbox' && (
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium hover-lift"
                  style={{ color: theme.colors.text.primary }}
                >
                  {field.label}
                  {field.required && (
                    <span style={{ color: '#EF4444' }}>*</span>
                  )}
                </label>
              )}
              
              {renderField(field, index)}
              
              {showError && (
                <p
                  className="text-xs form-transition"
                  style={{ color: '#EF4444' }}
                >
                  {error}
                </p>
              )}
            </div>
          );
        })}

        {/* Кнопка отправки */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium scale-press hover-lift form-transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
                Отправка...
              </div>
            ) : (
              message.submitLabel || 'Отправить'
            )}
          </button>
        </div>
      </form>

      {/* Информация о форме */}
      <div className="mt-4 pt-3 border-t form-transition">
        <p
          className="text-xs transition-opacity hover:opacity-100"
          style={{
            color: theme.colors.text.secondary,
            borderColor: theme.colors.border,
            opacity: 0.7
          }}
        >
          Заполните форму, чтобы продолжить диалог
        </p>
      </div>

      {/* Стили для анимации встряски */}
      <style>{`
        .shake-animation {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-3px); }
          40%, 60% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
});

FormMessage.displayName = 'FormMessage';

export default FormMessage;