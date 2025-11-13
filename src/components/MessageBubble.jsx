import React from 'react'
import './MessageBubble.css'

const MessageBubble = ({ message }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`message-bubble ${message.sender === 'ai' ? 'ai-message' : 'user-message'}`}>
      <div className="message-content">
        <div className="message-text">
          {message.text}
        </div>
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