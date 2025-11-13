import React, { useState } from 'react'
import SberIDAuth from './SberIDAuth'
import './LeadForm.css'

const LeadForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    businessType: ''
  })
  const [showSberID, setShowSberID] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false)
      onComplete()
    }, 1500)
  }

  const handleSberIDAuth = () => {
    setShowSberID(true)
  }

  const handleSberIDComplete = (userData) => {
    setFormData(prev => ({
      ...prev,
      name: userData.name || '',
      phone: userData.phone || '',
      email: userData.email || ''
    }))
    setShowSberID(false)
  }

  if (showSberID) {
    return <SberIDAuth onComplete={handleSberIDComplete} onCancel={() => setShowSberID(false)} />
  }

  return (
    <div className="lead-form fade-in">
      <h3>Оставить заявку</h3>
      <p className="form-description">
        Заполните форму, и наш специалист свяжется с вами для консультации
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">ФИО *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Телефон *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="input"
            placeholder="+7 (___) ___-__-__"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Название компании</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="businessType">Тип бизнеса</label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="input"
          >
            <option value="">Выберите тип бизнеса</option>
            <option value="retail">Розничная торговля</option>
            <option value="services">Услуги</option>
            <option value="production">Производство</option>
            <option value="it">IT-компания</option>
            <option value="other">Другое</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleSberIDAuth}
          >
            Заполнить через СберID
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LeadForm