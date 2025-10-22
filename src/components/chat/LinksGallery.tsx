import React, { memo, useCallback } from 'react';
import { LinksMessage, LinkItem } from '@/types/chat';
import { Theme } from '@/types/theme';

interface LinksGalleryProps {
  message: LinksMessage;
  theme: Theme;
}

const LinksGallery: React.FC<LinksGalleryProps> = memo(({ message, theme }) => {
  const handleLinkClick = useCallback((link: LinkItem) => {
    // Открыть ссылку в новой вкладке
    window.open(link.url, '_blank', 'noopener,noreferrer');
    
    // Можно добавить аналитику или логирование кликов
    console.log('Переход по ссылке:', link.title, link.url);
  }, []);

  const extractDomain = useCallback((url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return url;
    }
  }, []);

  const getFaviconUrl = useCallback((url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  }, []);

  const renderLinkItem = useCallback((link: LinkItem) => {
    const domain = link.domain || extractDomain(link.url);
    const faviconUrl = getFaviconUrl(link.url);

    return (
      <div
        key={link.id}
        className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`
        }}
        onClick={() => handleLinkClick(link)}
        role="button"
        tabIndex={0}
        aria-label={`Перейти к ${link.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleLinkClick(link);
          }
        }}
      >
        {/* Изображение/иконка */}
        <div className="flex-shrink-0">
          {link.imageUrl ? (
            <img
              src={link.imageUrl}
              alt=""
              className="w-12 h-12 rounded object-cover"
            />
          ) : faviconUrl ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-8 h-8 rounded"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded flex items-center justify-center text-sm"
              style={{
                backgroundColor: theme.colors.primary,
                color: '#FFFFFF'
              }}
            >
              🔗
            </div>
          )}
        </div>

        {/* Контент ссылки */}
        <div className="flex-1 min-w-0">
          {/* Заголовок */}
          <h4 
            className="text-sm font-medium truncate mb-1"
            style={{ color: theme.colors.text.primary }}
          >
            {link.title}
          </h4>

          {/* Описание */}
          {link.description && (
            <p 
              className="text-xs line-clamp-2 mb-2"
              style={{ color: theme.colors.text.secondary }}
            >
              {link.description}
            </p>
          )}

          {/* Домен и индикатор внешней ссылки */}
          <div className="flex items-center gap-2">
            <span 
              className="text-xs"
              style={{ color: theme.colors.text.secondary }}
            >
              {domain}
            </span>
            <span 
              className="text-xs opacity-70"
              style={{ color: theme.colors.text.secondary }}
            >
              ↗
            </span>
          </div>
        </div>
      </div>
    );
  }, [theme, handleLinkClick, extractDomain, getFaviconUrl]);

  const renderGridLayout = useCallback(() => {
    const columns = Math.min(message.links.length, 3); // Максимум 3 колонки
    return (
      <div 
        className={`grid gap-3 ${
          columns === 1 ? 'grid-cols-1' :
          columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {message.links.map(renderLinkItem)}
      </div>
    );
  }, [message.links, renderLinkItem]);

  const renderListLayout = useCallback(() => {
    return (
      <div className="space-y-2">
        {message.links.map(renderLinkItem)}
      </div>
    );
  }, [message.links, renderLinkItem]);

  return (
    <div className="links-gallery">
      {/* Заголовок галереи */}
      {message.title && (
        <h3 
          className="text-lg font-semibold mb-3"
          style={{ color: theme.colors.text.primary }}
        >
          {message.title}
        </h3>
      )}

      {/* Ссылки */}
      {message.layout === 'grid' ? renderGridLayout() : renderListLayout()}

      {/* Информация о галерее */}
      <div className="mt-3">
        <div 
          className="flex items-center gap-2 text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text.secondary
          }}
        >
          <span>🔗</span>
          <span>
            {message.links.length} ссылк{message.links.length === 1 ? 'а' : 'и'}
          </span>
          <span>•</span>
          <span>Нажмите для перехода</span>
        </div>
      </div>

      {/* Стили для обрезки текста */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
});

LinksGallery.displayName = 'LinksGallery';

export default LinksGallery;