import React, { lazy, Suspense } from 'react';
import { Theme } from '@/types/theme';

// Lazy loading для тяжелых компонентов
export const LazyTextMessage = lazy(() => import('./TextMessage'));
export const LazyFormMessage = lazy(() => import('./FormMessage'));
export const LazyTableMessage = lazy(() => import('./TableMessage'));
export const LazyImageMessage = lazy(() => import('./ImageMessage'));
export const LazyMapMessage = lazy(() => import('./MapMessage'));
export const LazyProgressMessage = lazy(() => import('./ProgressMessage'));
export const LazyCollapsibleReasoning = lazy(() => import('./CollapsibleReasoning'));
export const LazyButtonGroup = lazy(() => import('./ButtonGroup'));
export const LazyLinksGallery = lazy(() => import('./LinksGallery'));

// Компонент загрузки для Suspense
interface LoadingFallbackProps {
  theme: Theme;
  message?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  theme, 
  message = 'Загрузка...' 
}) => {
  return (
    <div 
      className="flex items-center justify-center p-4 rounded-lg"
      style={{
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: theme.colors.primary,
            borderTopColor: 'transparent'
          }}
        />
        <span 
          className="text-sm"
          style={{ color: theme.colors.text.secondary }}
        >
          {message}
        </span>
      </div>
    </div>
  );
};

// HOC для ленивой загрузки компонентов
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  fallbackMessage?: string
) => {
  return (props: P & { theme: Theme }) => (
    <Suspense fallback={<LoadingFallback theme={props.theme} message={fallbackMessage} />}>
      <Component {...props} />
    </Suspense>
  );
};

// Экспорт всех ленивых компонентов с fallback
export const LazyComponents = {
  TextMessage: LazyTextMessage,
  FormMessage: LazyFormMessage,
  TableMessage: LazyTableMessage,
  ImageMessage: LazyImageMessage,
  MapMessage: LazyMapMessage,
  ProgressMessage: LazyProgressMessage,
  CollapsibleReasoning: LazyCollapsibleReasoning,
  ButtonGroup: LazyButtonGroup,
  LinksGallery: LazyLinksGallery,
};