import React, { useState } from 'react'
import './SberIDAuth.css'

const SberIDAuth = ({ onComplete, onCancel }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [step, setStep] = useState('initial')

  const handleAuth = () => {
    setIsAuthenticating(true)
    setStep('authenticating')
    
    // Имитация процесса авторизации
    setTimeout(() => {
      setStep('success')
      
      // Имитация получения данных пользователя
      setTimeout(() => {
        const userData = {
          name: 'Иван Иванов',
          phone: '+7 (999) 123-45-67',
          email: 'ivan.ivanov@example.com'
        }
        onComplete(userData)
      }, 1000)
    }, 2000)
  }

  const renderStep = () => {
    switch(step) {
      case 'initial':
        return (
          <div className="auth-initial">
            <div className="sberid-logo">
              <div className="logo-circle">
                <span>С</span>
              </div>
              <h3>СберID</h3>
            </div>
            <p className="auth-description">
              Быстрая авторизация через СберID. Мы автоматически заполним ваши данные.
            </p>
            <div className="auth-benefits">
              <div className="benefit">
                <span className="benefit-icon">✓</span>
                <span>Безопасно</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">⚡</span>
                <span>Быстро</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔒</span>
                <span>Конфиденциально</span>
              </div>
            </div>
            <div className="auth-actions">
              <button className="btn btn-primary" onClick={handleAuth}>
                Войти через СберID
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                Отмена
              </button>
            </div>
          </div>
        )
      
      case 'authenticating':
        return (
          <div className="auth-process">
            <div className="loading-spinner"></div>
            <h3>Авторизация...</h3>
            <p>Пожалуйста, подождите, идет процесс авторизации</p>
          </div>
        )
      
      case 'success':
        return (
          <div className="auth-success">
            <div className="success-icon">✓</div>
            <h3>Успешная авторизация!</h3>
            <p>Ваши данные автоматически заполнены в форме</p>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="sberid-auth fade-in">
      <div className="auth-container">
        {renderStep()}
      </div>
    </div>
  )
}

export default SberIDAuth