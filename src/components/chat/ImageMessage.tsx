import React, { memo, useState, useCallback } from 'react';
import { ImageMessage as ImageMessageType } from '@/types/chat';
import { Theme } from '@/types/theme';

interface ImageMessageProps {
  message: ImageMessageType;
  theme: Theme;
}

const ImageMessage: React.FC<ImageMessageProps> = memo(({ message, theme }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageClick = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const handleCloseZoom = useCallback(() => {
    setIsZoomed(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = message.imageUrl;
    link.download = message.altText || 'image';
    link.click();
  }, [message.imageUrl, message.altText]);

  return (
    <div className="image-message">
      {/* Основное изображение */}
      <div className="relative">
        {/* Индикатор загрузки */}
        {isLoading && (
          <div 
            className="absolute inset-0 flex items-center justify-center rounded-lg"
            style={{
              backgroundColor: theme.colors.background
            }}
          >
            <div 
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{
                borderColor: theme.colors.primary,
                borderTopColor: 'transparent'
              }}
            />
          </div>
        )}

        {/* Сообщение об ошибке */}
        {hasError && (
          <div 
            className="flex flex-col items-center justify-center p-6 rounded-lg text-center"
            style={{
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <div className="text-2xl mb-2">❌</div>
            <p 
              className="text-sm"
              style={{ color: theme.colors.text.primary }}
            >
              Не удалось загрузить изображение
            </p>
          </div>
        )}

        {/* Изображение */}
        {!hasError && (
          <div 
            className="relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              border: `1px solid ${theme.colors.border}`
            }}
            onClick={handleImageClick}
          >
            <img
              src={message.imageUrl}
              alt={message.altText || 'Изображение от агента'}
              className={`w-full h-auto transition-opacity duration-200 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                maxWidth: message.width || '100%',
                maxHeight: message.height || '300px'
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        )}

        {/* Подпись */}
        {message.caption && !hasError && (
          <div className="mt-2">
            <p 
              className="text-sm italic"
              style={{ color: theme.colors.text.secondary }}
            >
              {message.caption}
            </p>
          </div>
        )}

        {/* Панель действий */}
        {!hasError && (
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={handleImageClick}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors hover:opacity-80"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text.primary
              }}
            >
              <span>🔍</span>
              Увеличить
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors hover:opacity-80"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text.primary
              }}
            >
              <span>⬇️</span>
              Скачать
            </button>
          </div>
        )}
      </div>

      {/* Модальное окно с увеличенным изображением */}
      {isZoomed && !hasError && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={handleCloseZoom}
        >
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={handleCloseZoom}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white bg-black bg-opacity-50 hover:bg-opacity-70 transition-all duration-200"
            >
              ✕
            </button>

            {/* Кнопка скачивания в модальном окне */}
            <button
              onClick={handleDownload}
              className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white bg-black bg-opacity-50 hover:bg-opacity-70 transition-all duration-200"
            >
              ⬇️
            </button>

            {/* Изображение в модальном окне */}
            <img
              src={message.imageUrl}
              alt={message.altText || 'Увеличенное изображение от агента'}
              className="max-w-full max-h-full object-contain"
            />

            {/* Подпись в модальном окне */}
            {message.caption && (
              <div 
                className="absolute bottom-0 left-0 right-0 p-4 text-center"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: '#FFFFFF'
                }}
              >
                <p className="text-sm">{message.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Информация о изображении */}
      <div className="mt-2">
        <div 
          className="flex items-center gap-2 text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text.secondary
          }}
        >
          <span>🖼️</span>
          <span>Изображение</span>
          {message.width && message.height && (
            <span>
              {message.width}×{message.height}px
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ImageMessage.displayName = 'ImageMessage';

export default ImageMessage;