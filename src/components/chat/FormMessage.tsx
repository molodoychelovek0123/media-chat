import React, { memo, useState, useCallback } from 'react';
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

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Очистить ошибку при изменении поля
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  }, [errors]);

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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
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

  const renderField = useCallback((field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    const commonProps = {
      id: field.id,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleFieldChange(field.id, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      className: `w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
        error 
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
      }`,
      style: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary,
        borderColor: error ? '#EF4444' : theme.colors.border
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
    <div className="form-message">
      {/* Заголовок формы */}
      {message.title && (
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: theme.colors.text.primary }}
        >
          {message.title}
        </h3>
      )}

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {message.fields.map(field => (
          <div key={field.id} className="space-y-2">
            {field.type !== 'checkbox' && (
              <label 
                htmlFor={field.id}
                className="block text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                {field.label}
                {field.required && (
                  <span style={{ color: '#EF4444' }}>*</span>
                )}
              </label>
            )}
            
            {renderField(field)}
            
            {errors[field.id] && (
              <p 
                className="text-xs"
                style={{ color: '#EF4444' }}
              >
                {errors[field.id]}
              </p>
            )}
          </div>
        ))}

        {/* Кнопка отправки */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF'
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
      <div className="mt-3 pt-3 border-t">
        <p 
          className="text-xs"
          style={{ 
            color: theme.colors.text.secondary,
            borderColor: theme.colors.border
          }}
        >
          Заполните форму, чтобы продолжить диалог
        </p>
      </div>
    </div>
  );
});

FormMessage.displayName = 'FormMessage';

export default FormMessage;