import React, { useState, useEffect } from 'react';
import './TopSlider.css';

const TopSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "СберБизнес Live",
      subtitle: "Медиа для предпринимателей",
      description: "Полезные статьи, новости и советы для вашего бизнеса",
      buttonText: "Читать статьи",
      image: "/img/original.jpg",
      bgColor: "linear-gradient(90deg, #21A038 0%, #1E8C32 100%)"
    },
    {
      title: "Бизнес-аналитика",
      subtitle: "Инсайты и тренды",
      description: "Актуальные данные и аналитика для принятия решений",
      buttonText: "Узнать больше",
      image: "/img/original1.jpg",
      bgColor: "linear-gradient(90deg, #1E8C32 0%, #1A7A2B 100%)"
    },
    {
      title: "Финансовые решения",
      subtitle: "Для вашего бизнеса",
      description: "Кредиты, РКО и другие финансовые продукты",
      buttonText: "Подробнее",
      image: "/img/original2.jpg",
      bgColor: "linear-gradient(90deg, #1A7A2B 0%, #166824 100%)"
    },
    {
      title: "Экспертные материалы",
      subtitle: "От профессионалов",
      description: "Советы от ведущих бизнес-экспертов",
      buttonText: "Изучить",
      image: "/img/original3.jpg",
      bgColor: "linear-gradient(90deg, #166824 0%, #13571F 100%)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="top-slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-content">
              <div className="slide-text">
                <h1 className="slide-title">{slide.title}</h1>
                <h2 className="slide-subtitle">{slide.subtitle}</h2>
                <p className="slide-description">{slide.description}</p>
                <button className="slide-button">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="slider-controls">
          <button className="slider-prev" onClick={prevSlide}>
            ‹
          </button>
          <button className="slider-next" onClick={nextSlide}>
            ›
          </button>
        </div>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopSlider;