# Архитектура нового сценария "Открытие кофейни"

## Обзор сценария

Новый сценарий реализует последовательное взаимодействие пользователя с AI-агентом для открытия кофейни с использованием всех доступных типов сообщений и интерактивных компонентов.

## Последовательность шагов сценария

### Шаг 1: Инициализация сценария
**Триггер:** Пользователь вводит сообщение со словом "кофе"
**Тип сообщения:** `text` + `button-group`
**Логика:**
- Агент распознает ключевое слово "кофе" через регулярное выражение
- Отправляет приветственное сообщение с предложением помощи
- Предлагает выбор режима двумя кнопками

```typescript
{
  trigger: /.*кофе.*/i,
  response: "Отлично! Я готов помочь вам с открытием кофейни! 🎯\n\nДавайте выберем подходящий режим консультации:",
  actions: [
    { type: 'button', label: 'ММБ - Модель малого бизнеса', payload: 'mmb' },
    { type: 'button', label: 'КБ - Консалтинг бизнеса', payload: 'kb' }
  ]
}
```

### Шаг 2: Выбор режима и смена темы
**Триггер:** Пользователь выбирает режим (ММБ/КБ)
**Тип сообщения:** `reasoning` (открытый коллапс)
**Логика:**
- При выборе режима автоматически меняется тема на зеленую
- Показывается цепочка рассуждений агента в развернутом состоянии
- Автоматический переход к следующему этапу

```typescript
{
  trigger: /.*ммб.*|.*кб.*/i,
  response: "Отличный выбор! Давайте перейдем к детальному анализу вашего проекта.",
  messageType: 'reasoning',
  messageData: {
    steps: [
      {
        id: '1',
        content: 'Пользователь выбрал бизнес-режим консультации',
        timestamp: new Date()
      },
      {
        id: '2',
        content: 'Активируем бизнес-тему оформления',
        timestamp: new Date()
      },
      {
        id: '3',
        content: 'Начинаем сбор данных о локации кофейни',
        timestamp: new Date()
      }
    ],
    isCollapsed: false // Открытый коллапс
  }
}
```

### Шаг 3: Показ формы для сбора информации
**Тип сообщения:** `form`
**Логика:**
- После рассуждений автоматически показывается форма
- Форма содержит поля для сбора базовой информации

```typescript
{
  messageType: 'form',
  messageData: {
    title: 'Информация о локации кофейни',
    fields: [
      {
        id: 'city',
        type: 'text',
        label: 'Город',
        placeholder: 'В каком городе планируете открыть кофейню?',
        required: true
      },
      {
        id: 'locationType',
        type: 'select',
        label: 'Тип локации',
        options: [
          { label: 'Деловой центр', value: 'business' },
          { label: 'Торговый центр', value: 'mall' },
          { label: 'Улица с пешеходным трафиком', value: 'street' },
          { label: 'Жилой район', value: 'residential' },
          { label: 'Университетский район', value: 'university' }
        ],
        required: true
      },
      {
        id: 'competition',
        type: 'textarea',
        label: 'Конкуренция в районе',
        placeholder: 'Опишите конкурентов поблизости...'
      }
    ],
    submitLabel: 'Продолжить анализ'
  }
}
```

### Шаг 4: Пошаговый сбор данных в чате
**Логика:**
- После показа формы агент начинает пошагово задавать вопросы в чате
- Каждый ответ пользователя автоматически заполняет соответствующее поле формы
- Визуальная обратная связь о заполнении полей

```typescript
// Пример последовательности вопросов:
// 1. "В каком городе вы планируете открыть кофейню?"
// 2. "Какой тип локации вас интересует?"
// 3. "Расскажите о конкурентах в этом районе?"
```

### Шаг 5: Уведомление о заполнении формы
**Тип сообщения:** `text` + `quick-replies`
**Логика:**
- После заполнения всех полей формы агент сообщает об успешном сборе данных
- Предлагает быстрые ответы для выбора типа анализа

```typescript
{
  messageType: 'quick-replies',
  messageData: {
    suggestions: [
      'Финансовый анализ',
      'Анализ конкурентов', 
      'Анализ рисков',
      'SWOT-анализ'
    ],
    maxVisible: 4
  }
}
```

### Шаг 6: Показ таблицы с расчетами
**Триггер:** Пользователь выбирает "Финансовый анализ"
**Тип сообщения:** `table`
**Логика:**
- Показывается таблица с детальными финансовыми расчетами
- Возможности сортировки и фильтрации данных

```typescript
{
  messageType: 'table',
  messageData: {
    title: 'Финансовый план кофейни (первый год)',
    columns: [
      { key: 'category', label: 'Категория', align: 'left', sortable: true },
      { key: 'amount', label: 'Сумма (руб)', align: 'right', sortable: true },
      { key: 'description', label: 'Описание', align: 'left' }
    ],
    data: [
      { category: 'Стартовые инвестиции', amount: 2500000, description: 'Ремонт, оборудование, мебель' },
      { category: 'Ежемесячные расходы', amount: 350000, description: 'Аренда, зарплаты, сырье' },
      { category: 'Прогноз выручки', amount: 600000, description: 'При 200 клиентах в день' },
      { category: 'Чистая прибыль', amount: 250000, description: 'После всех расходов' },
      { category: 'Окупаемость', amount: 10, description: 'Срок возврата инвестиций (месяцы)' }
    ],
    sortable: true,
    pagination: false
  }
}
```

### Шаг 7: Интерактивная карта с возможными местами
**Тип сообщения:** `map`
**Логика:**
- Показывается карта с потенциальными локациями для кофейни
- Интерактивные маркеры с подробной информацией
- Возможность полноэкранного просмотра

```typescript
{
  messageType: 'map',
  messageData: {
    title: 'Потенциальные локации для кофейни',
    center: { lat: 55.7558, lng: 37.6173 },
    zoom: 13,
    markers: [
      {
        id: '1',
        position: { lat: 55.7558, lng: 37.6173 },
        title: 'Центр города',
        description: 'Высокий пешеходный трафик, офисные работники',
        color: '#10B981',
        icon: '☕'
      }
    ],
    interactive: true
  }
}
```

### Шаг 8: Вопрос о расчетном счете
**Тип сообщения:** `button-group`
**Логика:**
- Агент спрашивает, нужен ли расчетный счет
- Предлагает варианты "Да" и "Нет"

```typescript
{
  messageType: 'button-group',
  messageData: {
    buttons: [
      {
        id: 'account-yes',
        label: 'Да, нужен расчетный счет',
        action: { type: 'button', label: 'Да', payload: 'account-yes' },
        variant: 'primary'
      },
      {
        id: 'account-no', 
        label: 'Нет, не нужен',
        action: { type: 'button', label: 'Нет', payload: 'account-no' },
        variant: 'secondary'
      }
    ],
    layout: 'horizontal'
  }
}
```

### Шаг 9: Помощь с открытием счета
**Триггер:** Пользователь выбирает "Нет"
**Тип сообщения:** `form`
**Логика:**
- Показывается форма для сбора данных для открытия счета
- Только поле ИНН (согласно уточнению)
- Условия и поздравления после заполнения

```typescript
{
  messageType: 'form',
  messageData: {
    title: 'Помощь с открытием расчетного счета',
    fields: [
      {
        id: 'inn',
        type: 'text',
        label: 'ИНН',
        placeholder: 'Введите ваш ИНН',
        required: true,
        validation: {
          pattern: /^\d{10,12}$/,
          min: 10,
          max: 12
        }
      }
    ],
    submitLabel: 'Отправить заявку'
  }
}
```

## Структуры данных

### Состояние сценария
```typescript
interface CoffeeShopScenario {
  currentStep: number;
  userData: {
    businessMode?: 'mmb' | 'kb';
    location?: {
      city: string;
      locationType: string;
      competition: string;
    };
    financialAnalysis?: {
      // Данные финансового анализа
    };
    accountRequest?: {
      inn: string;
      status: 'pending' | 'submitted' | 'completed';
    };
  };
  theme: ThemeType;
  formProgress: {
    location: number; // 0-100%
    financial: number;
    account: number;
  };
}
```

### Типы сообщений для каждого шага
| Шаг | Тип сообщения | Компонент | Особенности |
|-----|---------------|-----------|-------------|
| 1 | text + button-group | TextMessage + ButtonGroup | Инициализация сценария |
| 2 | reasoning | CollapsibleReasoning | Открытый коллапс, смена темы |
| 3 | form | FormMessage | Сбор базовой информации |
| 4 | text (серия) | TextMessage | Пошаговый сбор данных |
| 5 | quick-replies | QuickReplies | Выбор типа анализа |
| 6 | table | TableMessage | Финансовые расчеты |
| 7 | map | MapMessage | Интерактивная карта |
| 8 | button-group | ButtonGroup | Вопрос о счете |
| 9 | form | FormMessage | Заявка на счет |

## Логика обработки пользовательских действий

### Обработка выбора режима
```typescript
function handleModeSelection(mode: 'mmb' | 'kb') {
  // Смена темы на зеленую
  setScenarioTheme('green');
  
  // Сохранение выбора в состоянии
  updateScenarioData({ businessMode: mode });
  
  // Показ reasoning-сообщения
  showReasoningMessage();
  
  // Автоматический переход к форме локации
  setTimeout(() => showLocationForm(), 1000);
}
```

### Обработка пошагового сбора данных
```typescript
function handleStepByStepData(step: number, userInput: string) {
  const fieldMapping = {
    1: 'city',
    2: 'locationType', 
    3: 'competition'
  };
  
  // Обновление данных формы
  updateFormData(fieldMapping[step], userInput);
  
  // Визуальная обратная связь
  showFieldCompletion(fieldMapping[step]);
  
  // Переход к следующему вопросу или завершению
  if (step < 3) {
    showNextQuestion(step + 1);
  } else {
    showAnalysisOptions();
  }
}
```

### Интеграция с существующими компонентами

Все компоненты уже реализованы и готовы к использованию:
- [`CollapsibleReasoning`](src/components/chat/CollapsibleReasoning.tsx:1) - для цепочки рассуждений
- [`FormMessage`](src/components/chat/FormMessage.tsx:1) - для сбора данных
- [`QuickReplies`](src/components/chat/QuickReplies.tsx:1) - для быстрых ответов
- [`TableMessage`](src/components/chat/TableMessage.tsx:1) - для финансовых таблиц
- [`MapMessage`](src/components/chat/MapMessage.tsx:1) - для интерактивных карт
- [`ButtonGroup`](src/components/chat/ButtonGroup.tsx:1) - для выбора вариантов

## План реализации

### Фаза 1: Модификация MockAgentService
1. Обновить триггеры в [`MockAgentService.ts`](src/services/agent/MockAgentService.ts:25)
2. Добавить новые шаги сценария с правильной последовательностью
3. Реализовать логику пошагового сбора данных

### Фаза 2: Обновление состояний
1. Расширить интерфейс [`CoffeeShopScenario`](src/types/agent.ts:43)
2. Добавить обработку новых типов данных в [`AgentContext`](src/contexts/AgentContext.tsx:40)

### Фаза 3: Интеграция компонентов
1. Настроить автоматические переходы между шагами
2. Реализовать визуальную обратную связь при заполнении форм
3. Протестировать все типы сообщений в последовательности

### Фаза 4: Тестирование
1. Проверить последовательность шагов
2. Убедиться в корректной смене тем
3. Протестировать все интерактивные элементы

## Преимущества архитектуры

1. **Модульность** - каждый шаг независим и может быть легко изменен
2. **Расширяемость** - легко добавить новые шаги или типы анализа
3. **Совместимость** - полная интеграция с существующими компонентами
4. **Пользовательский опыт** - плавные переходы и интерактивность
5. **Техническая надежность** - использование проверенных компонентов и паттернов