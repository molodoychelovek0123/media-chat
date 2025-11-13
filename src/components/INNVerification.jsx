import React, { useState } from 'react'
import './INNVerification.css'

const INNVerification = ({ onComplete }) => {
  const [inn, setInn] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const handleInnChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Только цифры
    setInn(value)
  }

  const handleVerify = () => {
    if (inn.length === 10 || inn.length === 12) {
      setIsChecking(true)
      
      // Имитация проверки ИНН
      setTimeout(() => {
        setIsVerified(true)
        setIsChecking(false)
      }, 1500)
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  return (
    <div className="inn-verification fade-in">
      <h3>Уточнение ИНН</h3>
      <p className="inn-description">
        Для завершения обработки заявки уточните ваш ИНН
      </p>

      <div className="inn-form">
        <div className="form-group">
          <label htmlFor="inn">ИНН *</label>
          <input
            type="text"
            id="inn"
            name="inn"
            value={inn}
            onChange={handleInnChange}
            placeholder="Введите 10 или 12 цифр"
            maxLength={12}
            className="inn-input"
            disabled={isVerified}
          />
          <div className="inn-hint">
            ИНН состоит из 10 цифр для организаций или 12 цифр для физических лиц
          </div>
        </div>

        {!isVerified && (
          <button 
            className="btn btn-primary verify-btn"
            onClick={handleVerify}
            disabled={isChecking || (inn.length !== 10 && inn.length !== 12)}
          >
            {isChecking ? 'Проверка...' : 'Проверить ИНН'}
          </button>
        )}

        {isVerified && (
          <div className="verification-success">
            <div className="success-icon">✓</div>
            <div className="success-content">
              <h4>ИНН успешно проверен!</h4>
              <p>ИНН: {inn}</p>
              <p className="success-message">
                Данные успешно верифицированы. Ваша заявка полностью готова к обработке.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="inn-actions">
        <button 
          className="btn btn-primary"
          onClick={handleComplete}
          disabled={!isVerified}
        >
          Завершить оформление
        </button>
      </div>

      <div className="inn-benefits">
        <h4>Зачем нужен ИНН?</h4>
        <div className="benefits-list">
          <div className="benefit-item">
            <span className="benefit-number">1</span>
            <span>Идентификация в налоговой системе</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-number">2</span>
            <span>Оформление юридических документов</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-number">3</span>
            <span>Открытие расчетного счета</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-number">4</span>
            <span>Участие в государственных программах</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default INNVerification