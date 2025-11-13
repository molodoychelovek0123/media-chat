import React, { useState } from 'react'
import ChatPage from './components/ChatPage'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('chat')

  return (
    <div className="app">
      <div className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <img
                src="/img/sber_logo_white.svg"
                alt="Сбер"
                className="logo"
              />
              <nav className="header-nav">
                <a href="#" className="nav-link">Бизнес-услуги</a>
                <a href="#" className="nav-link">Финансы</a>
                <a href="#" className="nav-link">Страхование</a>
                <a href="#" className="nav-link">Инвестиции</a>
                <a href="#" className="nav-link">Аналитика</a>
              </nav>
            </div>
            <div className="header-right">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Поиск по сайту..."
                  className="search-input"
                />
                <button className="search-btn">🔍</button>
              </div>
              <button className="header-btn">Личный кабинет</button>
              <button className="header-btn btn-primary">Открыть счёт</button>
            </div>
          </div>
        </div>
      </div>

      <main className="app-main">
        <div className="container">
          <ChatPage />
        </div>
      </main>
    </div>
  )
}

export default App