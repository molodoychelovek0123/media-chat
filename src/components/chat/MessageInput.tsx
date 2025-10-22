import React, { useState, useRef, useCallback, memo, useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChat } from '@/hooks/useChat'

const MessageInput: React.FC = memo(() => {
  const { theme } = useTheme()
  const { sendMessage, uploadFile, isLoading } = useChat()
  const [message, setMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      sendMessage(message.trim())
      setMessage('')
      // Сброс высоты textarea после отправки
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }, [message, sendMessage, isLoading])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }, [handleSubmit])

  // Автоматическое изменение высоты textarea
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Автоматическое изменение высоты
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }, [])

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Проверка размера файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 10MB')
      return
    }

    // Проверка типа файла
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      alert('Неподдерживаемый тип файла. Разрешены: изображения, PDF, документы Word, Excel, текстовые файлы')
      return
    }

    uploadFile(file)
  }, [uploadFile])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Сброс значения input для возможности загрузки того же файла снова
    if (e.target) e.target.value = ''
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Мемоизация состояния кнопки отправки
  const canSendMessage = useMemo(() =>
    message.trim() && !isLoading,
    [message, isLoading]
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="sdds-message-input p-4 gpu-accelerated"
      style={{
        backgroundColor: theme.colors.surface
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.xls,.xlsx"
        className="sdds-input-file hidden"
      />

      {/* Индикатор перетаскивания файла */}
      {isDragging && (
        <div
          className="sdds-dropzone-overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg form-transition"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }}
        >
          <div
            className="sdds-dropzone-card text-center p-6 rounded-lg hover-lift"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
              border: `2px dashed ${theme.colors.primary}`
            }}
          >
            <div className="sdds-dropzone-icon text-3xl mb-3 animate-bounce">📁</div>
            <p className="sdds-heading-2 font-medium text-lg">Отпустите файл для загрузки</p>
            <p className="sdds-paragraph text-sm opacity-70 mt-1">Поддерживаются: изображения, PDF, документы</p>
          </div>
        </div>
      )}

      <div className="sdds-input-container flex gap-3 items-end">
        {/* Кнопка загрузки файла */}
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isLoading}
          className="sdds-button sdds-button--secondary sdds-button--icon flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center scale-press hover-lift form-transition disabled:opacity-50"
          style={{
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text.primary,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          title="Загрузить файл"
        >
          <span className="sdds-icon text-lg transition-transform hover:scale-110">📎</span>
        </button>

        {/* Поле ввода сообщения */}
        <div className="sdds-textarea-container flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isLoading ? "Обработка запроса..." : "Введите ваше сообщение..."}
            disabled={isLoading}
            className="sdds-textarea w-full resize-none rounded-lg px-4 py-3 focus:outline-none form-transition disabled:opacity-50"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary,
              border: `1px solid ${isFocused ? theme.colors.primary : theme.colors.border}`,
              minHeight: '48px',
              maxHeight: '120px',
              boxShadow: isFocused ? `0 0 0 2px ${theme.colors.primary}20` : 'none'
            }}
            rows={1}
          />
          
          {/* Подсказка для перетаскивания файлов */}
          {message.length === 0 && !isFocused && (
            <div
              className="sdds-input-hint absolute inset-0 flex items-center justify-center pointer-events-none form-transition"
              style={{
                color: theme.colors.text.secondary,
                opacity: isDragging ? 0 : 0.5
              }}
            >
              <span className="sdds-paragraph text-sm">или перетащите файл сюда</span>
            </div>
          )}
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!canSendMessage}
          className="sdds-button sdds-button--primary px-6 py-3 rounded-lg font-medium scale-press hover-lift form-transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: canSendMessage ? theme.colors.primary : theme.colors.border,
            color: '#FFFFFF',
            boxShadow: canSendMessage ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
          }}
        >
          {isLoading ? (
            <div className="sdds-button-content flex items-center gap-2">
              <div className="sdds-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="sdds-button-text font-medium">...</span>
            </div>
          ) : (
            <div className="sdds-button-content flex items-center gap-2">
              <span className="sdds-button-text font-medium">Отправить</span>
              <span className="sdds-shortcut text-xs opacity-80">↵</span>
            </div>
          )}
        </button>
      </div>

      {/* Информация о поддерживаемых файлах */}
      <div
        className="sdds-input-info text-xs mt-3 text-center form-transition"
        style={{
          color: theme.colors.text.secondary,
          opacity: isFocused ? 0.7 : 0.5
        }}
      >
        Поддерживаются: изображения, PDF, документы Word, Excel (до 10MB)
      </div>
    </form>
  )
})

MessageInput.displayName = 'MessageInput'

export default MessageInput