import React from 'react'
import ReactMarkdown from 'react-markdown'
import './MessageBubble.css'

const MessageBubble = ({message, onLinkClick, onOpenReport}) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderMessageContent = () => {
    if (message.isFile) {
      return (
        <div className="message-file">
          <div className="file-icon">📄</div>
          <div className="file-info">
            <div className="file-name">{message.fileName}</div>
            <div className="file-actions-container">
              <a
                href={message.fileUrl}
                download={message.fileName}
                className="file-download-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Скачать PDF
              </a>
              {message.hasOnlineReport && (
                <button
                  className="online-report-btn btn-primary"
                  onClick={() => onOpenReport && onOpenReport()}
                >
                  Онлайн отчет
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    if (message.isPublications) {
      // Массив изображений для публикаций
      const publicationImages = [
        "https://sberbusiness.live/bcp-laika-public/08d66768-955f-4a40-8744-6ee829586da7/original",
        "https://sberbusiness.live/bcp-laika-public/ce4889be-47aa-42f2-9908-698e61d99098/original",
        "/img/original3.jpg",
        "https://sberbusiness.live/bcp-laika-public/2fc0f77c-9383-451a-876a-cc48e1829e1d/original",
        "https://sberbusiness.live/bcp-laika-public/688fb91d-8a6c-4d98-8784-e98716f9c660/original",
        "https://sberbusiness.live/bcp-laika-public/d174a2a0-b874-411d-9052-903e1d825efc/original"
      ];
      
      return (
        <div className="message-publications">
          <div className="publications-text">{message.text}</div>
          <div className="publications-grid">
            {message.publications.map((publication, index) => (
              <div key={index} className="publication-card">
                <div className="publication-image">
                  <img src={publicationImages[index]} alt={publication} />
                </div>
                <div className="publication-content">
                  <h4 className="publication-title">{publication}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (message.isMarkdown) {
      return (
        <div className="message-markdown">
          <ReactMarkdown
            components={{
              a: ({node, href, ...props}) => (
                <a {...props} href={href} target="_self" rel="noopener noreferrer"
                   style={{color: 'var(--primary-color)', textDecoration: 'underline'}}
                   onClick={(event) => {
                     event.preventDefault();
                     onLinkClick(href)
                   }}
                />
              )
            }}
          >
            {message.text}
          </ReactMarkdown>

        </div>
      )
    }

    return (
      <div className="message-text">
        {message.text}
        {message.isTyping && (
          <span className="typing-cursor">|</span>
        )}
      </div>
    )
  }

  return (
    <div className={`message-bubble ${message.sender === 'ai' ? 'ai-message' : 'user-message'}`}>
      <div className="message-content">
        {renderMessageContent()}
        {/* <div className="message-time">
          {formatTime(message.timestamp)}
        </div> */}
      </div>
      {/* {message.sender === 'ai' && (
        <div className="ai-avatar">
          <span>AI</span>
        </div>
      )} */}
    </div>
  )
}

export default MessageBubble