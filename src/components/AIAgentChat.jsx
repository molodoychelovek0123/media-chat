import React, { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import './AIAgentChat.css'

const AIAgentChat = ({ onMapSelect }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Отлично! Я помогу вам с выбранной услугой. Расскажите подробнее о вашем бизнесе, чтобы я мог предложить наилучшее решение.",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (text, sender = 'user') => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputText.trim()) {
      addMessage(inputText, 'user')
      setInputText('')
      setIsTyping(true)
      
      // Имитация ответа AI
      setTimeout(() => {
        const aiResponses = [
          "Интересно! Продолжайте, я анализирую информацию...",
          "Отличные данные! На основе этой информации я могу предложить...",
          "Понимаю вашу ситуацию. Давайте рассмотрим оптимальные решения...",
          "Спасибо за подробности! Теперь я могу дать более точные рекомендации..."
        ]
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
        addMessage(randomResponse, 'ai')
        setIsTyping(false)
        
        // После нескольких сообщений предлагаем карту
        if (messages.length >= 4) {
          setTimeout(() => {
            addMessage("Для более точного анализа давайте выберем локацию вашего бизнеса на карте.", 'ai')
          }, 1000)
        }
      }, 1500)
    }
  }

  const handleMapButton = () => {
    addMessage("Хочу выбрать локацию на карте", 'user')
    setTimeout(() => {
      addMessage("Отлично! Выберите регион на карте для анализа бизнес-возможностей.", 'ai')
      onMapSelect()
    }, 1000)
  }

  return (
    <div className="ai-agent-chat">
      <div className="ai-chat-header">
        <h3>AI-Агент</h3>
        <p>Специализированный помощник для вашего бизнеса</p>
      </div>
      
      <div className="ai-messages-container">
        {messages.map(message => (
          <MessageBubble 
            key={message.id} 
            message={message} 
          />
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>AI печатает...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-actions">
        <button 
          className="btn btn-primary"
          onClick={handleMapButton}
        >
          Выбрать локацию на карте
        </button>
      </div>

      <form onSubmit={handleSendMessage} className="ai-message-input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Расскажите о вашем бизнесе..."
          className="ai-message-input"
        />
        <button type="submit" className="ai-send-button">
          Отправить
        </button>
      </form>
    </div>
  )
}

export default AIAgentChat