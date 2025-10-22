import React, { memo, useCallback } from 'react';
import { TextMessage as TextMessageType } from '@/types/chat';
import { Theme } from '@/types/theme';

interface TextMessageProps {
  message: TextMessageType;
  theme: Theme;
}

const TextMessage: React.FC<TextMessageProps> = memo(({ message, theme }) => {
  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      // Можно добавить уведомление об успешном копировании
      console.log('Код скопирован в буфер обмена');
    });
  }, []);

  const renderMarkdownContent = useCallback((content: string) => {
    // Базовая поддержка Markdown
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Обработка заголовков
      if (line.startsWith('### ')) {
        return (
          <h3 
            key={index}
            className="text-lg font-semibold mt-4 mb-2"
            style={{ color: theme.colors.text.primary }}
          >
            {line.replace('### ', '')}
          </h3>
        );
      }
      
      if (line.startsWith('## ')) {
        return (
          <h2 
            key={index}
            className="text-xl font-bold mt-4 mb-2"
            style={{ color: theme.colors.text.primary }}
          >
            {line.replace('## ', '')}
          </h2>
        );
      }
      
      if (line.startsWith('# ')) {
        return (
          <h1 
            key={index}
            className="text-2xl font-bold mt-4 mb-3"
            style={{ color: theme.colors.text.primary }}
          >
            {line.replace('# ', '')}
          </h1>
        );
      }
      
      // Обработка кодовых блоков
      if (line.startsWith('```')) {
        const codeStart = lines.findIndex(l => l.startsWith('```'));
        const codeEnd = lines.findIndex((l, i) => i > codeStart && l.startsWith('```'));
        
        if (codeStart === index && codeEnd > codeStart) {
          const codeContent = lines.slice(codeStart + 1, codeEnd).join('\n');
          return (
            <div key={index} className="my-3">
              <div 
                className="flex justify-between items-center px-3 py-2 rounded-t-lg text-xs"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text.secondary
                }}
              >
                <span>Код</span>
                <button
                  onClick={() => handleCopyCode(codeContent)}
                  className="px-2 py-1 rounded hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: '#FFFFFF'
                  }}
                >
                  Копировать
                </button>
              </div>
              <pre 
                className="p-3 rounded-b-lg overflow-x-auto text-sm"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }
        return null;
      }
      
      // Пропустить строки с закрывающими кодовыми блоками
      if (line === '```' && index > 0) {
        return null;
      }
      
      // Обработка жирного текста
      let processedLine = line;
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      processedLine = processedLine.replace(/`(.*?)`/g, '<code>$1</code>');
      
      // Обработка ссылок
      processedLine = processedLine.replace(
        /\[(.*?)\]\((.*?)\)/g, 
        '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: ' + theme.colors.primary + '">$1</a>'
      );
      
      // Обработка списков
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li 
            key={index}
            className="ml-4"
            style={{ color: theme.colors.text.primary }}
            dangerouslySetInnerHTML={{ __html: processedLine.slice(2) }}
          />
        );
      }
      
      // Обычный текст
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      return (
        <p 
          key={index}
          className="mb-2 last:mb-0"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    });
  }, [theme, handleCopyCode]);

  const renderPlainContent = useCallback((content: string) => {
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-2 last:mb-0">
        {line}
      </p>
    ));
  }, []);

  return (
    <div className="text-message">
      {message.format === 'markdown' 
        ? renderMarkdownContent(message.content)
        : renderPlainContent(message.content)
      }
      
      {/* Стили для Markdown элементов */}
      {message.format === 'markdown' && (
        <style>{`
          .text-message strong { 
            font-weight: 600; 
            color: ${theme.colors.text.primary};
          }
          .text-message em { 
            font-style: italic; 
            color: ${theme.colors.text.primary};
          }
          .text-message code { 
            background: ${theme.colors.background}; 
            padding: 0.1rem 0.3rem; 
            border-radius: 0.25rem; 
            font-family: monospace; 
            color: ${theme.colors.text.primary};
            border: 1px solid ${theme.colors.border};
          }
          .text-message a { 
            text-decoration: underline; 
            transition: opacity 0.2s;
          }
          .text-message a:hover { 
            opacity: 0.8; 
          }
          .text-message ul { 
            list-style-type: disc; 
            margin-left: 1rem; 
            margin-bottom: 1rem;
          }
          .text-message li { 
            margin-bottom: 0.25rem; 
          }
        `}</style>
      )}
    </div>
  );
});

TextMessage.displayName = 'TextMessage';

export default TextMessage;