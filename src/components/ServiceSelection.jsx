import React from 'react'
import './ServiceSelection.css'

const ServiceSelection = ({ onServiceSelect }) => {
  const services = [
    {
      id: 'competitor-analysis',
      title: 'Анализ конкурентов',
      description: 'Полный анализ конкурентной среды вашего бизнеса',
      icon: '📊'
    },
    {
      id: 'business-plan',
      title: 'Разработать БП',
      description: 'Создание детального бизнес-плана для вашего проекта',
      icon: '📈'
    },
    {
      id: 'marketing-strategy',
      title: 'Маркетинговая стратегия',
      description: 'Разработка эффективной маркетинговой стратегии',
      icon: '🎯'
    }
  ]

  return (
    <div className="service-selection fade-in">
      <h3>Пока ждете звонка от консультанта</h3>
      <p className="selection-description">
        Выберите дополнительную услугу для вашего бизнеса:
      </p>
      
      <div className="services-grid">
        {services.map(service => (
          <div 
            key={service.id}
            className="service-card"
            onClick={() => onServiceSelect(service.title)}
          >
            <div className="service-icon">
              {service.icon}
            </div>
            <div className="service-content">
              <h4>{service.title}</h4>
              <p>{service.description}</p>
            </div>
            <div className="service-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServiceSelection