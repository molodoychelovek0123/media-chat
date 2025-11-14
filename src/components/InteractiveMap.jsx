import React from 'react'
import './InteractiveMap.css'

const InteractiveMap = ({ onLocationSelect }) => {
  const handleMapClick = () => {
    // При клике на блок с картой сразу запускаем процесс выбора локации
    onLocationSelect('Россия')
  }

  return (
    <div className="interactive-map fade-in">
      <h3>Выбор локации для бизнеса</h3>
      <p className="map-description">
        Нажмите на карту для выбора локации и анализа бизнес-возможностей
      </p>

      <div className="map-container">
        <div className="russia-map" onClick={handleMapClick}>
          {/* Карта 2GIS в iframe */}
          <iframe
            src="https://2gis.ru/geo/70030076160677611?m=37.617222%2C55.755833%2F10"
            width="100%"
            height="400"
            frameBorder="0"
            allowFullScreen
            title="Карта России 2GIS"
            className="map-iframe"
          />
        </div>
      </div>

      <div className="map-actions">
        <p className="map-hint">
          Нажмите на карту для продолжения процесса выбора локации
        </p>
      </div>
    </div>
  )
}

export default InteractiveMap