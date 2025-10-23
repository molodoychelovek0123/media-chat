
# План реализации нового сценария "Открытие кофейни"

## Обзор изменений

Для реализации нового сценария требуется модификация существующего кода с минимальными изменениями архитектуры. Все необходимые компоненты уже реализованы.

## Фаза 1: Модификация MockAgentService

### Задача 1.1: Обновить триггеры и последовательность шагов
**Файл:** [`src/services/agent/MockAgentService.ts`](src/services/agent/MockAgentService.ts:20)

```typescript
// В методе createBusinessScenario() заменить существующие шаги на новые:

private createBusinessScenario(): BusinessScenario {
  return {
    steps: [
      // Шаг 1: Инициализация по слову "кофе"
      {
        trigger: /.*кофе.*/i,
        response: "Отлично! Я готов помочь вам с открытием кофейни! 🎯\n\nДавайте выберем подходящий режим консультации:",
        actions: [
          { type: 'button', label: 'ММБ - Модель малого бизнеса', payload: 'mmb' },
          { type: 'button', label: 'КБ - Консалтинг бизнеса', payload: 'kb' }
        ]
      },
      
      // Шаг 2: Выбор ММБ режима
      {
        trigger: /.*ммб.*/i,
        response: "Отличный выбор! Модель малого бизнеса идеально подходит для старта кофейни. 🚀\n\nДавайте перейдем к детальному анализу вашего проекта.",
        messageType: 'reasoning',
        messageData: {
          steps: [
            { id: '1', content: 'Пользователь выбрал ММБ режим для открытия кофейни', timestamp: new Date() },
            { id: '2', content: 'ММБ подходит для проектов с инвестициями до 5 млн рублей', timestamp: new Date() },
            { id: '3', content: 'Начинаем анализ ключевых параметров бизнеса', timestamp: new Date() }
          ],
          isCollapsed: false // Открытый коллапс
        }
      },
      
      // Шаг 3: Выбор КБ режима
      {
        trigger: /.*кб.*/i,
        response: "Консалтинг бизнеса выбран! Этот режим подходит для более масштабных проектов. 📊\n\nПриступим к комплексному анализу.",
        messageType: 'reasoning',
        messageData: {
          steps: [
            { id: '1', content: 'Пользователь выбрал КБ режим для открытия кофейни', timestamp: new Date() },
            { id: '2', content: 'КБ подходит для проектов с инвестициями от 5 млн рублей', timestamp: new Date() },
            { id: '3', content: 'Начинаем детальный анализ всех аспектов бизнеса', timestamp: new Date() }
          ],
          isCollapsed: false // Открытый коллапс
        }
      },
      
      // Шаг 4: Форма сбора данных о локации (автоматически после reasoning)
      {
        trigger: /.*перейти.*локаци.*/i, // Внутренний триггер
        response: "Давайте соберем информацию о планируемой локации кофейни:",
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
      },
      
      // Шаг 5: Пошаговый сбор данных (серия текстовых сообщений)
      {
        trigger: /.*город.*|.*локаци.*|.*конкуренци.*/i,
        response: "Понял! Давайте уточним детали:",
        // Логика пошагового сбора будет обрабатываться отдельно
      },
      
      // Шаг 6: Быстрые ответы для анализа
      {
        trigger: /.*анализ.*|.*продолжить.*/i,
        response: "Отлично! Все данные собраны. 🎉\n\nКакой анализ вас интересует?",
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
      },
      
      // Шаг 7: Финансовый анализ
      {
        trigger: /.*финансовый.*анализ.*/i,
        response: "Переходим к финансовому планированию. 💰\n\nДавайте рассчитаем основные показатели:",
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
      },
      
      // Шаг 8: Карта с потенциальными локациями
      {
        trigger: /.*карта.*|.*локации.*/i,
        response: "Отличная идея! Вот карта с потенциальными локациями для кофейни в выбранном районе: 🗺️",
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
            },
            {
              id: '2',
              position: { lat: 55.7600, lng: 37.6200 },
              title: 'Бизнес-центр',
              description: 'Деловой район, высокая аренда, премиальная аудитория',
              color: '#3B82F6',
              icon: '🏢'
            }
          ],
          interactive: true
        }
      },
      
      // Шаг 9: Вопрос о расчетном счете
      {
        trigger: /.*счет.*|.*банк.*/i,
        response: "Отлично! Нужен ли вам расчетный счет для ведения бизнеса?",
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
      },
      
      // Шаг 10: Помощь с открытием счета
      {
        trigger: /.*нет.*не.*нужен.*/i,
        response: "Понял! Но я все равно могу помочь с открытием расчетного счета. Это упростит ведение бизнеса:",
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
      },
      
      // Шаг 11: Завершение сценария
      {
        trigger: /.*заявка.*отправлен.*/i,
        response: "🎉 Отлично! Ваша заявка на открытие расчетного счета принята!\n\nУсловия:\n- Бесплатное открытие счета\n- Первые 3 месяца обслуживания бесплатно\n- Онлайн-банкинг и мобильное приложение\n\nПоздравляю с началом вашего бизнес-пути! 🚀",
        messageType: 'text'
      }
    ]
  }
}
```

### Задача 1.2: Реализовать логику автоматических переходов
**Файл:** [`src/services/agent/MockAgentService.ts`](src/services/agent/MockAgentService.ts:334)

```typescript
// В методе sendMessage() добавить логику автоматических переходов:

async sendMessage(message: string): Promise<AgentResponse> {
  // ... существующий код имитации печатания и задержки

  const step = this.findMatchingStep(message);

  if (step) {
    // Автоматическая смена темы при выборе бизнес-режима
    if (message.toLowerCase().includes('ммб') || message.toLowerCase().includes('кб')) {
      this.coffeeShopScenario.theme = 'green';
      if (this.config.onThemeChange) {
        this.config.onThemeChange('green');
      }

      // Автоматический переход к форме локации после reasoning
      const reasoningMessage = this.createAgentMessage(step);
      
      // Создаем комбинированный ответ
      return {
        message: step.response,
        type: 'text',
        metadata: {
          messageType: reasoningMessage.type,
          messageData: reasoningMessage,
          // Флаг для автоматического показа формы
          autoShowForm: true
        }
      };
    }

    // ... остальная логика
  }
}
```

## Фаза 2: Расширение интерфейсов состояний

### Задача 2.1: Обновить интерфейсы данных
**Файл:** [`src/types/agent.ts`](src/types/agent.ts:43)

```typescript
// Расширить интерфейс CoffeeShopScenario:

export interface CoffeeShopScenario {
  currentStep: number;
  userData: {
    businessType?: string;
    location?: string;
    budget?: number;
    experience?: string;
    targetAudience?: string;
    
    // Новые поля для расширенного сценария
    businessMode?: 'mmb' | 'kb';
    locationData?: {
      city: string;
      locationType: string;
      competition: string;
    };
    financialAnalysis?: {
      initialInvestment: number;
      monthlyExpenses: number;
      projectedRevenue: number;
      netProfit: number;
      paybackPeriod: number;
    };
    accountRequest?: {
      inn: string;
      submittedAt?: Date;
      status: 'pending' | 'submitted' | 'completed';
    };
  };
  theme: ThemeType;
  
  // Новое поле для отслеживания прогресса
  formProgress?: {
    location: {
      completed: boolean;
      fields: {
        city: boolean;
        locationType: boolean;
        competition: boolean;
      };
    };
    account: {
      completed: boolean;
      fields: {
        inn: boolean;
      };
    };
  };
}
```

## Фаза 3: Интеграция с UI компонентами

### Задача 3.1: Обновить обработку автоматических переходов
**Файл:** [`src/contexts/ChatContext.tsx`](src/contexts/ChatContext.tsx:129)

```typescript
// В обработчике отправки сообщений добавить логику автоматических переходов:

const handleSendMessage = async (content: string) => {
  // ... существующий код
  
  const response = await agentService.sendMessage(content);
  const agentMessage = processAgentResponse(response);
  
  if (agentMessage) {
    // Добавляем сообщение агента
    addMessage(agentMessage);
    
    // Проверяем наличие флага автоматического показа формы
    if (response.metadata?.autoShowForm) {
      // Через 2 секунды автоматически показываем форму локации
      setTimeout(() => {
        triggerAutoForm('location');
      }, 2000);
    }
  }
};
```

## Фаза 4: Реализация пошагового сбора данных

### Задача 4.1: Создать менеджер пошагового сбора
**Новый файл:** `src/services/agent/StepByStepManager.ts`

```typescript
import { CoffeeShopScenario } from '@/types/agent';

export class StepByStepManager {
  private currentStep: number = 0;
  private steps: Step[] = [
    {
      id: 'city',
      question: "В каком городе вы планируете открыть кофейню?",
      field: 'city',
      validation: (value: string) => value.length > 0
    },
    {
      id: 'locationType', 
      question: "Какой тип локации вас интересует?",
      field: 'locationType',
      validation: (value: string) => ['business', 'mall', 'street', 'residential', 'university'].includes(value)
    },
    {
      id: 'competition',
      question: "Расскажите о конкурентах в этом районе?",
      field: 'competition',
      validation: (value: string) => true // Необязательное поле
    }
  ];

  getCurrentQuestion(): string {
    return this.steps[this.currentStep].question;
  }

  processAnswer(answer: string, scenario: CoffeeShopScenario): boolean {
    const currentStep = this.steps[this.currentStep];
    
    if (currentStep.validation(answer)) {
      // Обновляем данные сценария
      scenario.userData.locationData = {
        ...scenario.userData.locationData,
        [currentStep.field]: answer
      };
      
      // Переходим к следующему шагу
      this.currentStep++;
      
      return this.currentStep < this.steps.length;
    }
    
    return false; // Ошибка валидации
  }

  isCompleted(): boolean {
    return this.currentStep >= this.steps.length;
  }
}

interface Step {
  id: string;
  question: string;
  field: string;
  validation: (value: string) => boolean;
}
```

## Фаза 5: Тестирование

### Задача 5.1: Создать тестовый сценарий
**Файл:** `src/demo/new-coffee-scenario-test.md`

```markdown
# Тестирование нового сценария "Открытие кофейни"

## Последовательность тестирования:

1. **Инициализация**
   - Ввести: "Хочу открыть кофейню"
   - Ожидать: Приветствие + кнопки выбора режима

2. **Выбор режима** 
   - Нажать: "ММБ - Модель малого бизнеса"
   - Ожидать: Смена темы на зеленую + reasoning (открытый коллапс)

3. **Автоматический переход к форме**
   - Ожидать: Автоматический показ формы локации через 2 секунды

4. **Пошаговый сбор данных**
   - Ожидать: Серия вопросов в чате о городе, типе локации, конкурентах
   - Отвечать на каждый вопрос

5. **Выбор анализа**
   - Ожидать: Quick-replies с вариантами анализа
   - Выбрать: "Финансовый анализ"

6. **Финансовый анализ**
   - Ожидать: Таблица с расчетами

7. **Карта локаций**
   - Ожидать: Интерактивная карта

8. **Вопрос о счете**
   - Ожидать: Кноп