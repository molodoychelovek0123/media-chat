import React, { useState } from 'react'
import './InteractiveMap.css'

const InteractiveMap = ({ onLocationSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState(null)

  const regions = [
    { id: 'moscow', name: 'Москва', coordinates: { x: 50, y: 30 } },
    { id: 'spb', name: 'Санкт-Петербург', coordinates: { x: 40, y: 25 } },
    { id: 'central', name: 'Центральный регион', coordinates: { x: 45, y: 35 } },
    { id: 'ural', name: 'Уральский регион', coordinates: { x: 65, y: 30 } },
    { id: 'siberia', name: 'Сибирский регион', coordinates: { x: 75, y: 35 } },
    { id: 'south', name: 'Южный регион', coordinates: { x: 50, y: 50 } },
    { id: 'far-east', name: 'Дальний Восток', coordinates: { x: 90, y: 40 } }
  ]

  const handleRegionClick = (region) => {
    setSelectedRegion(region)
  }

  const handleConfirmLocation = () => {
    if (selectedRegion) {
      onLocationSelect(selectedRegion.name)
    }
  }

  return (
    <div className="interactive-map fade-in">
      <h3>Выбор локации для бизнеса</h3>
      <p className="map-description">
        Выберите регион на карте России для анализа бизнес-возможностей
      </p>

      <div className="map-container">
        <div className="russia-map">
          {/* Упрощенная карта России в виде SVG */}
          <svg viewBox="0 0 100 60" className="map-svg">
            {/* Контур России (упрощенный) */}
            <path 
              d="M30,10 L40,5 L50,8 L60,5 L70,10 L75,15 L80,20 L85,25 L82,30 L78,35 L75,40 L70,45 L65,50 L60,55 L55,50 L50,45 L45,40 L40,35 L35,30 L32,25 L30,20 Z" 
              fill="#e8f4fd" 
              stroke="#21a038" 
              strokeWidth="0.5"
            />
            
            {/* Точки для регионов */}
            {regions.map(region => (
              <g key={region.id}>
                <circle 
                  cx={region.coordinates.x}
                  cy={region.coordinates.y}
                  r={selectedRegion?.id === region.id ? "3" : "2"}
                  fill={selectedRegion?.id === region.id ? "#21a038" : "#667eea"}
                  stroke="#fff"
                  strokeWidth="1"
                  className="region-point"
                  onClick={() => handleRegionClick(region)}
                />
                {selectedRegion?.id === region.id && (
                  <text 
                    x={region.coordinates.x}
                    y={region.coordinates.y - 5}
                    textAnchor="middle"
                    fontSize="3"
                    fill="#21a038"
                    fontWeight="bold"
                  >
                    {region.name}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="regions-list">
          <h4>Регионы России:</h4>
          <div className="region-buttons">
            {regions.map(region => (
              <button
                key={region.id}
                className={`region-btn ${selectedRegion?.id === region.id ? 'selected' : ''}`}
                onClick={() => handleRegionClick(region)}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedRegion && (
        <div className="selected-region-info">
          <h4>Выбранный регион: {selectedRegion.name}</h4>
          <p>
            Анализ бизнес-возможностей в регионе {selectedRegion.name} показывает 
            перспективные направления для развития. Наш AI-агент подготовит 
            детальный отчет по выбранной локации.
          </p>
        </div>
      )}

      <div className="map-actions">
        <button 
          className="btn btn-primary"
          onClick={handleConfirmLocation}
          disabled={!selectedRegion}
        >
          Подтвердить выбор локации
        </button>
      </div>
    </div>
  )
}

export default InteractiveMap