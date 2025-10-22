import React, { memo, useCallback } from 'react'
import { FileMessage } from '@/types/chat'
import { Theme } from '@/types/theme'

interface FileMessageBubbleProps {
  message: FileMessage
  theme: Theme
  sender: 'user' | 'agent'
}

const FileMessageBubble: React.FC<FileMessageBubbleProps> = memo(({ 
  message, 
  theme, 
  sender 
}) => {
  const handleDownload = useCallback(() => {
    const link = document.createElement('a')
    link.href = message.fileUrl
    link.download = message.fileName
    link.click()
  }, [message.fileUrl, message.fileName])

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const getFileIcon = useCallback((mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
    if (mimeType.includes('text')) return '📄'
    return '📎'
  }, [])

  const getFileExtension = useCallback((fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || 'FILE'
  }, [])

  return (
    <div className="message-content">
      <div 
        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:opacity-80 transition-all duration-200 active:scale-95"
        style={{
          backgroundColor: sender === 'user' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : theme.colors.surface,
          border: `1px solid ${theme.colors.border}`
        }}
        onClick={handleDownload}
        title={`Скачать ${message.fileName}`}
      >
        {/* Иконка файла */}
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ 
            backgroundColor: sender === 'user' 
              ? 'rgba(255, 255, 255, 0.2)' 
              : theme.colors.primary 
          }}
        >
          <span 
            className="text-lg"
            style={{ 
              color: sender === 'user' ? theme.colors.text.primary : '#FFFFFF' 
            }}
          >
            {getFileIcon(message.mimeType)}
          </span>
        </div>

        {/* Информация о файле */}
        <div className="flex-1 min-w-0">
          <p 
            className="text-sm font-medium truncate"
            style={{ color: theme.colors.text.primary }}
          >
            {message.fileName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text.secondary
              }}
            >
              {getFileExtension(message.fileName)}
            </span>
            <span 
              className="text-xs"
              style={{ color: theme.colors.text.secondary }}
            >
              {formatFileSize(message.fileSize)}
            </span>
          </div>
        </div>

        {/* Кнопка скачивания */}
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: theme.colors.text.primary
          }}
        >
          <span className="text-sm">⬇️</span>
        </div>
      </div>

      {/* Статус загрузки */}
      {message.status === 'sending' && (
        <div className="flex items-center gap-2 mt-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: theme.colors.accent }}
          />
          <span 
            className="text-xs"
            style={{ color: theme.colors.text.secondary }}
          >
            Загрузка...
          </span>
        </div>
      )}

      {message.status === 'error' && (
        <div className="flex items-center gap-2 mt-2">
          <span 
            className="text-xs"
            style={{ color: theme.colors.accent }}
          >
            ❌ Ошибка загрузки
          </span>
        </div>
      )}
    </div>
  )
})

FileMessageBubble.displayName = 'FileMessageBubble'

export default FileMessageBubble