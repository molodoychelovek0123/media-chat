import React from 'react'
import './RKOSection.css'

const RKOSection = ({ onComplete, onOpenAccount }) => {
  const benefits = [
    {
      title: "Бесплатное открытие",
      description: "Откройте расчетный счет без комиссии"
    },
    {
      title: "Онлайн-обслуживание",
      description: "Полный доступ через интернет-банк"
    },
    {
      title: "Выгодные тарифы",
      description: "Специальные условия для бизнеса"
    },
    {
      title: "Быстрое подключение",
      description: "Начните работу в течение 1 дня"
    }
  ]

  return (
    <div className="rko-section fade-in">
      <h3>Открытие расчетного счета в Сбере</h3>
      <p className="rko-description">
        Современные решения для вашего бизнеса с максимальным комфортом и выгодой
      </p>
      
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-card">
            <div className="benefit-icon">
              <span>✓</span>
            </div>
            <div className="benefit-content">
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="rko-actions">
        <button className="btn btn-primary" onClick={onOpenAccount}>
          Открыть счет онлайн
        </button>
        <button className="btn btn-secondary" onClick={onComplete}>
          Узнать подробнее
        </button>
      </div>
    </div>
  )
}

export default RKOSection