import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { MapMessage as MapMessageType, MapMarker } from '@/types/chat';
import { Theme } from '@/types/theme';

interface MapMessageProps {
  message: MapMessageType;
  theme: Theme;
  onAction?: (action: any) => void;
}

const MapMessage: React.FC<MapMessageProps> = memo(({ message, theme, onAction }) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Функция для генерации статической карты через Google Maps Static API
  const generateStaticMapUrl = useCallback(() => {
    const { center, zoom = 12, markers } = message;
    
    // Базовый URL для Google Maps Static API
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    
    // Параметры центра и масштаба
    const params = new URLSearchParams({
      center: `${center.lat},${center.lng}`,
      zoom: zoom.toString(),
      size: '600x400',
      scale: '2',
      key: 'YOUR_API_KEY' // Замените на реальный API ключ Google Maps
    });

    // Добавляем маркеры
    markers.forEach((marker, index) => {
      const markerColor = marker.color || '#10B981'; // Зеленый по умолчанию для бизнес-темы
      const markerLabel = marker.icon || String.fromCharCode(65 + index); // A, B, C, ...
      
      params.append('markers', `color:${markerColor}|label:${markerLabel}|${marker.position.lat},${marker.position.lng}`);
    });

    // Добавляем стили для лучшего отображения
    params.append('style', 'feature:all|element:labels|visibility:off');
    params.append('style', 'feature:landscape|color:0xf5f5f5');
    params.append('style', 'feature:water|color:0xc9d2d8');

    return `${baseUrl}?${params.toString()}`;
  }, [message]);

  // Функция для выбора локации
  const handleLocationSelect = useCallback((marker: MapMarker) => {
    if (onAction) {
      onAction({
        type: 'location-select',
        payload: {
          locationId: marker.id,
          locationName: marker.title,
          coordinates: marker.position,
          description: marker.description
        }
      });
    }
  }, [onAction]);

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleOpenInMaps = useCallback(() => {
    const { center } = message;
    const url = `https://www.google.com/maps?q=${center.lat},${center.lng}&z=${message.zoom || 12}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [message]);

  // Обработчик клика вне попапа
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedMarker && !(event.target as Element).closest('.marker-popup')) {
        handleClosePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedMarker, handleClosePopup]);

  return (
    <div className="map-message">
      {/* Заголовок карты */}
      {message.title && (
        <h3 
          className="text-lg font-semibold mb-3"
          style={{ color: theme.colors.text.primary }}
        >
          {message.title}
        </h3>
      )}

      {/* Контейнер карты */}
      <div 
        ref={mapContainerRef}
        className={`relative rounded-lg overflow-hidden border ${
          isFullscreen ? 'fixed inset-4 z-50' : ''
        }`}
        style={{
          borderColor: theme.colors.border,
          height: isFullscreen ? 'calc(100vh - 2rem)' : (message.height || 300),
          width: isFullscreen ? 'calc(100vw - 2rem)' : (message.width || '100%')
        }}
      >
        {/* Статическое изображение карты */}
        <div className="relative w-full h-full">
          <img
            src={generateStaticMapUrl()}
            alt={`Карта с центром в ${message.center.lat}, ${message.center.lng}`}
            className="w-full h-full object-cover"
          />

          {/* Интерактивные области для маркеров */}
          {message.markers.map((marker, index) => (
            <button
              key={marker.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-125 scale-press ${
                selectedMarker?.id === marker.id ? 'scale-125 z-10' : 'z-0'
              }`}
              style={{
                backgroundColor: marker.color || theme.colors.primary,
                color: '#FFFFFF',
                left: `${50 + (marker.position.lng - message.center.lng) * 1000}%`,
                top: `${50 - (marker.position.lat - message.center.lat) * 1000}%`,
                boxShadow: selectedMarker?.id === marker.id
                  ? `0 0 0 3px ${theme.colors.primary}`
                  : '0 2px 8px rgba(0,0,0,0.4)'
              }}
              onClick={() => handleMarkerClick(marker)}
              aria-label={`Маркер: ${marker.title}`}
            >
              {marker.icon || String.fromCharCode(65 + index)}
            </button>
          ))}
        </div>

        {/* Панель управления картой */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleFullscreenToggle}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-200 shadow-lg hover-lift scale-press"
            aria-label={isFullscreen ? 'Выйти из полноэкранного режима' : 'Открыть в полноэкранном режиме'}
          >
            {isFullscreen ? '⤓' : '⤢'}
          </button>

          <button
            onClick={handleOpenInMaps}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-200 shadow-lg hover-lift scale-press"
            aria-label="Открыть в Google Maps"
          >
            ↗
          </button>
        </div>

        {/* Попап с информацией о маркере */}
        {selectedMarker && (
          <div
            className="marker-popup absolute bottom-4 left-4 right-4 p-4 rounded-lg shadow-lg z-20 form-transition"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <h4
                className="text-sm font-semibold"
                style={{ color: theme.colors.text.primary }}
              >
                {selectedMarker.title}
              </h4>
              <button
                onClick={handleClosePopup}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs hover:opacity-70 transition-opacity hover-lift"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text.primary
                }}
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
            
            {selectedMarker.description && (
              <p
                className="text-sm mb-3"
                style={{ color: theme.colors.text.secondary }}
              >
                {selectedMarker.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span
                className="text-xs"
                style={{ color: theme.colors.text.secondary }}
              >
                Координаты: {selectedMarker.position.lat.toFixed(6)}, {selectedMarker.position.lng.toFixed(6)}
              </span>
              
              {/* Кнопка выбора локации */}
              {message.interactive && onAction && (
                <button
                  onClick={() => handleLocationSelect(selectedMarker)}
                  className="px-3 py-1 rounded text-xs font-medium scale-press hover-lift"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: '#FFFFFF'
                  }}
                >
                  Выбрать локацию
                </button>
              )}
            </div>
          </div>
        )}

        {/* Затемнение для полноэкранного режима */}
        {isFullscreen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 z-40"
            onClick={handleFullscreenToggle}
          />
        )}
      </div>

      {/* Информация о карте */}
      <div className="mt-3">
        <div 
          className="flex items-center gap-2 text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text.secondary
          }}
        >
          <span>🗺️</span>
          <span>
            Карта с {message.markers.length} маркер{message.markers.length === 1 ? 'ом' : 'ами'}
          </span>
          <span>•</span>
          <span>Центр: {message.center.lat.toFixed(4)}, {message.center.lng.toFixed(4)}</span>
          {message.interactive && (
            <>
              <span>•</span>
              <span>Интерактивная</span>
            </>
          )}
        </div>
      </div>

      {/* Информация о карте */}
      <div className="mt-3">
        <div
          className="flex items-center gap-2 text-xs px-2 py-1 rounded form-transition hover-lift"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text.secondary
          }}
        >
          <span>🗺️</span>
          <span>
            Карта с {message.markers.length} маркер{message.markers.length === 1 ? 'ом' : 'ами'}
          </span>
          <span>•</span>
          <span>Центр: {message.center.lat.toFixed(4)}, {message.center.lng.toFixed(4)}</span>
          {message.interactive && (
            <>
              <span>•</span>
              <span>Интерактивная</span>
            </>
          )}
        </div>
      </div>

      {/* Предупреждение об API ключе */}
      <div className="mt-2">
        <div
          className="flex items-center gap-2 text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: '#FEF3CD',
            color: '#92400E'
          }}
        >
          <span>⚠️</span>
          <span>
            Для работы карт требуется API ключ Google Maps. Замените 'YOUR_API_KEY' на реальный ключ.
          </span>
        </div>
      </div>
    </div>
  );
});

MapMessage.displayName = 'MapMessage';

export default MapMessage;