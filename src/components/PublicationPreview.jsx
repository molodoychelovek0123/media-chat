import React from 'react'
import './PublicationPreview.css'

const PublicationPreview = ({ onComplete }) => {
  const publication = {
    title: "С выгодой для бизнеса: что получают предприниматели при открытии счета",
    summary: "При открытии расчетного счета в Сбере предприниматели получают комплекс преимуществ: бесплатное открытие счета, выгодные тарифы, доступ к онлайн-банкингу, интеграцию с бухгалтерскими сервисами, а также специальные условия для малого и среднего бизнеса. Банк предлагает гибкие решения, адаптированные под потребности конкретного бизнеса.",
    url: "https://sberbusiness.live/publications/s-vigodoi-dlya-biznesa-chto-poluchayut-predprinimateli-pri-otkritii-scheta",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%2321a038' opacity='0.1'/%3E%3Crect x='50' y='50' width='200' height='100' fill='%2321a038' opacity='0.3'/%3E%3Ctext x='150' y='120' font-family='Arial' font-size='16' fill='%2321a038' text-anchor='middle'%3EПубликация Сбер%3C/text%3E%3C/svg%3E"
  }

  return (
    <div className="publication-preview fade-in">
      <h3>Публикации для бизнеса</h3>
      
      <div className="publication-card">
        <div className="publication-image">
          <img src={publication.image} alt={publication.title} />
        </div>
        
        <div className="publication-content">
          <h4>{publication.title}</h4>
          <p className="publication-summary">{publication.summary}</p>
          
          <div className="publication-actions">
            <a 
              href={publication.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Читать полностью
            </a>
            <button className="btn btn-secondary" onClick={onComplete}>
              Вернуться в чат
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicationPreview