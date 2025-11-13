import React from 'react';
import './ArticleCards.css';

const ArticleCards = () => {
  const articles = [
    {
      id: 1,
      title: "115-ФЗ простыми словами: что должен знать предприниматель",
      description: "Разбираем основные положения закона о противодействии легализации доходов и финансированию терроризма",
      category: "Финансы",
      readTime: "5 мин",
      date: "15 ноября 2024",
      image: "/img/original8.jpg",
      url: "#"
    },
    {
      id: 2,
      title: "АУСН в 2026 году: особенности налогового режима",
      description: "Новый автоматизированный упрощенный налоговый режим для малого бизнеса",
      category: "Налоги",
      readTime: "7 мин",
      date: "12 ноября 2024",
      image: "/img/original5.jpg",
      url: "#"
    },
    {
      id: 3,
      title: "Аварийно-диспетчерская служба: как организовать работу",
      description: "Практические советы по созданию эффективной АДС для управляющих компаний",
      category: "Управление",
      readTime: "6 мин",
      date: "10 ноября 2024",
      image: "/img/original6.jpg",
      url: "#"
    },
    {
      id: 4,
      title: "Вычет по НДС: как рассчитать и оформить малому бизнесу",
      description: "Пошаговая инструкция по получению налогового вычета для предпринимателей",
      category: "Налоги",
      readTime: "8 мин",
      date: "8 ноября 2024",
      image: "/img/original7.jpg",
      url: "#"
    }
  ];

  return (
    <div className="article-cards">
      <div className="articles-header">
        <h2 className="articles-title">Популярные статьи</h2>
        <p className="articles-subtitle">Актуальные материалы для вашего бизнеса</p>
      </div>
      
      <div className="articles-grid">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <div className="article-image">
              <img src={article.image} alt={article.title} />
            </div>
            
            <div className="article-content">
              <div className="article-meta">
                <span className="article-category">{article.category}</span>
                <span className="article-read-time">{article.readTime}</span>
              </div>
              
              <h3 className="article-title">{article.title}</h3>
              <p className="article-description">{article.description}</p>
              
              <div className="article-footer">
                <span className="article-date">{article.date}</span>
                <button className="article-read-btn">Читать</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="articles-footer">
        <button className="view-all-btn">Смотреть все статьи</button>
      </div>
    </div>
  );
};

export default ArticleCards;