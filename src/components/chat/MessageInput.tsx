import React, { useState, useRef, useCallback, memo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useChat } from '@/hooks/useChat'

const MessageInput: React.FC = memo(() => {
  const { theme } = useTheme()
  const { sendMessage, uploadFile, isLoading } = useChat()
  const [message, setMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      sendMessage(message.trim())
      setMessage('')
    }
  }, [message, sendMessage, isLoading])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }, [handleSubmit])

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

  return (
    <form 
      onSubmit={handleSubmit}
      className="p-4"
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
        className="hidden"
      />

      {/* Индикатор перетаскивания файла */}
      {isDragging && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }}
        >
          <div 
            className="text-center p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary
            }}
          >
            <div className="text-2xl mb-2">📁</div>
            <p className="font-medium">Отпустите файл для загрузки</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 items-end">
        {/* Кнопка загрузки файла */}
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isLoading}
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors hover:opacity-80 disabled:opacity-50"
          style={{
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text.primary
          }}
          title="Загрузить файл"
        >
          <span className="text-lg">📎</span>
        </button>

        {/* Поле ввода сообщения */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "Обработка запроса..." : "Введите ваше сообщение..."}
            disabled={isLoading}
            className="w-full resize-none rounded-lg px-4 py-3 focus:outline-none transition-all disabled:opacity-50"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border}`,
              minHeight: '48px',
              maxHeight: '120px'
            }}
            rows={1}
          />
          
          {/* Подсказка для перетаскивания файлов */}
          {message.length === 0 && (
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50"
              style={{ color: theme.colors.text.secondary }}
            >
              <span className="text-sm">или перетащите файл сюда</span>
            </div>
          )}
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            backgroundColor: message.trim() && !isLoading ? theme.colors.primary : theme.colors.border,
            color: '#FFFFFF'
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>...</span>
            </div>
          ) : (
            'Отправить'
          )}
        </button>
      </div>

      {/* Информация о поддерживаемых файлах */}
      <div 
        className="text-xs mt-2 text-center"
        style={{ color: theme.colors.text.secondary }}
      >
        Поддерживаются: изображения, PDF, документы Word, Excel (до 10MB)
      </div>
    </form>
  )
})

MessageInput.displayName = 'MessageInput'

export default MessageInput