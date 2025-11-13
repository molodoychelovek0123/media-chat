import React, { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import RKOSection from './RKOSection'
import PublicationPreview from './PublicationPreview'
import LeadForm from './LeadForm'
import ServiceSelection from './ServiceSelection'
import AIAgentChat from './AIAgentChat'
import InteractiveMap from './InteractiveMap'
import INNVerification from './INNVerification'
import TopSlider from './TopSlider'
import ArticleCards from './ArticleCards'
import './ChatPage.css'

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Привет! Я ваш ИИ-помощник от Сбера. Чем могу помочь вашему бизнесу сегодня?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [currentStep, setCurrentStep] = useState('main')
  const [isAnimating, setIsAnimating] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Прокрутка к низу при смене шага (когда появляется высокий компонент)
    if (currentStep !== 'main') {
      setTimeout(() => {
        scrollToBottom()
      }, 350) // Задержка для завершения анимации
    }
  }, [currentStep])

  const addMessage = (text, sender = 'user') => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const changeStepWithAnimation = (newStep) => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(newStep)
      setTimeout(() => {
        setIsAnimating(false)
      }, 50)
    }, 300)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputText.trim()) {
      addMessage(inputText, 'user')
      setInputText('')

      // Имитация ответа AI
      setTimeout(() => {
        addMessage("Спасибо за ваш вопрос! Я могу помочь вам с различными бизнес-задачами. Выберите одну из опций ниже.", 'ai')
      }, 1000)
    }
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'rko':
        changeStepWithAnimation('rko')
        addMessage("Хочу открыть РКО", 'user')
        setTimeout(() => {
          addMessage("Отлично! Расскажу вам о преимуществах открытия расчетного счета в Сбере.", 'ai')
        }, 500)
        break
      case 'publication':
        changeStepWithAnimation('publication')
        addMessage("Покажи публикации", 'user')
        break
      case 'lead':
        changeStepWithAnimation('lead')
        addMessage("Хочу оставить заявку", 'user')
        break
      default:
        break
    }
  }

  const handleServiceSelect = (service) => {
    changeStepWithAnimation('ai-chat')
    addMessage(`Выбрана услуга: ${service}`, 'user')
  }

  const handleFormComplete = () => {
    changeStepWithAnimation('waiting')
    addMessage("Форма заполнена, жду звонка", 'user')
    setTimeout(() => {
      addMessage("Отлично! Пока ждете звонка от нашего консультанта, могу предложить дополнительные услуги для вашего бизнеса.", 'ai')
    }, 1000)
  }

  const handleMapSelect = (location) => {
    changeStepWithAnimation('inn')
    addMessage(`Выбрана локация: ${location}`, 'user')
  }

  const handleINNComplete = () => {
    changeStepWithAnimation('main')
    addMessage("ИНН подтвержден", 'user')
    setTimeout(() => {
      addMessage("Спасибо! Все данные получены. Наш специалист свяжется с вами в ближайшее время.", 'ai')
    }, 1000)
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'rko':
        return <RKOSection onComplete={() => changeStepWithAnimation('main')} />
      case 'publication':
        return <PublicationPreview onComplete={() => changeStepWithAnimation('main')} />
      case 'lead':
        return <LeadForm onComplete={handleFormComplete} />
      case 'waiting':
        return <ServiceSelection onServiceSelect={handleServiceSelect} />
      case 'ai-chat':
        return <AIAgentChat onMapSelect={() => changeStepWithAnimation('map')} />
      case 'map':
        return <InteractiveMap onLocationSelect={handleMapSelect} />
      case 'inn':
        return <INNVerification onComplete={handleINNComplete} />
      default:
        return (
          <div className="quick-actions">
            <h3>Быстрые действия:</h3>
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={() => handleQuickAction('rko')}
              >
                Открыть РКО
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleQuickAction('publication')}
              >
                Публикации
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleQuickAction('lead')}
              >
                Оставить заявку
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className='chat-scroll'>
          <div className="messages-container">
            {/* Верхний слайдер */}
            <TopSlider />
            
            {/* Подборка карточек статей */}
            <ArticleCards />
            
            {messages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
              />
            ))}
            <div ref={messagesEndRef} />
            {messages.length > 2 && (
              <div className={`interactive-section ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                {renderCurrentStep()}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Введите ваше сообщение..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            Отправить
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatPage