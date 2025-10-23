import { AgentService, AgentResponse, MockAgentConfig, BusinessScenario, BusinessScenarioStep, CoffeeShopScenario } from '@/types/agent'
import { Message, TextMessage } from '@/types/chat'
import { ThemeType } from '@/types/theme'

export class MockAgentService implements AgentService {
  private currentScenario: BusinessScenario
  private coffeeShopScenario: CoffeeShopScenario
  private _isTyping: boolean = false

  constructor(private config: MockAgentConfig) {
    this.currentScenario = this.createBusinessScenario()
    this.coffeeShopScenario = {
      currentStep: 0,
      userData: {},
      theme: 'purple'
    }
  }

  private createBusinessScenario(): BusinessScenario {
    return {
      steps: [
        // Шаг 1: Инициализация сценария
        {
          trigger: /.*кофе.*/i,
          response: "Отлично! Я готов помочь вам с открытием кофейни! 🎯\n\nДавайте выберем подходящий режим консультации:",
          actions: [
            { type: 'button', label: 'ММБ - Модель малого бизнеса', payload: 'mmb' },
            { type: 'button', label: 'КБ - Консалтинг бизнеса', payload: 'kb' }
          ]
        },
        // Шаг 2: Выбор режима ММБ
        {
          trigger: /.*ммб.*/i,
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
            isCollapsed: false
          }
        },
        // Шаг 3: Выбор режима КБ
        {
          trigger: /.*кб.*/i,
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
            isCollapsed: false
          }
        },
        // Шаг 4: Форма для сбора информации о локации
        {
          trigger: /.*локация.*|.*город.*|.*местоположение.*/i,
          response: "Понял! Давайте соберем информацию о локации вашей будущей кофейни.",
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
                id: 'budget',
                type: 'range',
                label: 'Бюджет на открытие (млн руб)',
                validation: {
                  min: 1,
                  max: 10,
                  step: 0.5
                }
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
        // Шаг 5: Пошаговый сбор данных - вопрос о городе
        {
          trigger: /.*город.*|.*москва.*|.*санкт-петербург.*|.*екатеринбург.*/i,
          response: "В каком городе вы планируете открыть кофейню?",
          messageType: 'text'
        },
        // Шаг 6: Пошаговый сбор данных - вопрос о типе локации
        {
          trigger: /.*тип.*|.*локация.*|.*район.*/i,
          response: "Какой тип локации вас интересует?",
          messageType: 'quick-replies',
          messageData: {
            suggestions: [
              'Деловой центр',
              'Торговый центр',
              'Улица с пешеходным трафиком',
              'Жилой район',
              'Университетский район'
            ],
            maxVisible: 5
          }
        },
        // Шаг 7: Пошаговый сбор данных - вопрос о конкурентах
        {
          trigger: /.*конкуренты.*|.*соперники.*|.*конкуренция.*/i,
          response: "Расскажите о конкурентах в этом районе?",
          messageType: 'text'
        },
        // Шаг 8: Уведомление о заполнении формы
        {
          trigger: /.*готово.*|.*заполнено.*|.*собрано.*/i,
          response: "Отлично! Мы собрали всю необходимую информацию о локации. 🎉\n\nТеперь давайте выберем тип анализа:",
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
        // Шаг 9: Финансовый анализ
        {
          trigger: /.*финанс.*|.*бюджет.*|.*инвестици.*/i,
          response: "Переходим к финансовому планированию. 💰",
          messageType: 'table',
          messageData: {
            title: 'Финансовый план кофейни (первый год)',
            columns: [
              { key: 'category', label: 'Категория', align: 'left', sortable: true },
              { key: 'amount', label: 'Сумма', align: 'right', sortable: true },
              { key: 'description', label: 'Описание', align: 'left' },
              { key: 'percent', label: 'Доля в бюджете', align: 'right', sortable: true }
            ],
            data: [
              { category: 'Стартовые инвестиции', amount: 2500000, description: 'Ремонт, оборудование, мебель', percent: 100 },
              { category: 'Ежемесячные расходы', amount: 350000, description: 'Аренда, зарплаты, сырье', percent: 14 },
              { category: 'Прогноз выручки', amount: 600000, description: 'При 200 клиентах в день', percent: 24 },
              { category: 'Чистая прибыль', amount: 250000, description: 'После всех расходов', percent: 10 },
              { category: 'Окупаемость', amount: 10, description: 'Срок возврата инвестиций (месяцы)', percent: null }
            ],
            sortable: true,
            filterable: true,
            pagination: false
          }
        },
        // Шаг 10: Интерактивная карта с возможными местами
        {
          trigger: /.*карта.*|.*локации.*|.*места.*/i,
          response: "Отличная идея! Вот карта с потенциальными локациями для кофейни в выбранном районе: 🗺️",
          messageType: 'map',
          messageData: {
            title: 'Потенциальные локации для кофейни',
            center: {
              lat: 55.7558,
              lng: 37.6173
            },
            zoom: 13,
            markers: [
              {
                id: '1',
                position: {
                  lat: 55.7558,
                  lng: 37.6173
                },
                title: 'Центр города',
                description: 'Высокий пешеходный трафик, офисные работники',
                color: '#10B981',
                icon: '☕'
              },
              {
                id: '2',
                position: {
                  lat: 55.7600,
                  lng: 37.6200
                },
                title: 'Бизнес-центр',
                description: 'Деловой район, высокая аренда, премиальная аудитория',
                color: '#3B82F6',
                icon: '🏢'
              },
              {
                id: '3',
                position: {
                  lat: 55.7500,
                  lng: 37.6100
                },
                title: 'Студенческий район',
                description: 'Молодежная аудитория, умеренная аренда, сезонность',
                color: '#8B5CF6',
                icon: '🎓'
              },
              {
                id: '4',
                position: {
                  lat: 55.7650,
                  lng: 37.6250
                },
                title: 'Жилой комплекс',
                description: 'Стабильная аудитория, семейный формат, вечерний трафик',
                color: '#F59E0B',
                icon: '🏠'
              }
            ],
            height: 400,
            width: 600,
            interactive: true
          }
        },
        // Шаг 11: Вопрос о расчетном счете
        {
          trigger: /.*счет.*|.*банк.*|.*расчетный.*/i,
          response: "Нужен ли вам расчетный счет для бизнеса?",
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
        // Шаг 12: Помощь с открытием счета (форма для ИНН)
        {
          trigger: /.*нет.*|.*не нужен.*/i,
          response: "Понял! Но если решите открыть счет позже, мы поможем. А пока давайте продолжим анализ вашего проекта.",
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
      ]
    }
  }

  private findMatchingStep(message: string): BusinessScenarioStep | null {
    // Поиск по всему массиву шагов, а не только с текущей позиции
    for (let i = 0; i < this.currentScenario.steps.length; i++) {
      if (this.currentScenario.steps[i].trigger.test(message)) {
        return this.currentScenario.steps[i]
      }
    }
    return null
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private createAgentMessage(step: BusinessScenarioStep): Message {
    const baseMessage = {
      id: this.generateMessageId(),
      timestamp: new Date(),
      sender: 'agent' as const,
      status: 'sent' as const
    }

    if (step.messageType && step.messageData) {
      return {
        ...baseMessage,
        type: step.messageType,
        ...step.messageData
      } as Message
    }

    // Стандартное текстовое сообщение
    return {
      ...baseMessage,
      type: 'text',
      content: step.response,
      format: 'plain'
    } as TextMessage
  }

  async sendMessage(message: string): Promise<AgentResponse> {
    // Имитация печатания
    this._isTyping = true
    await this.delay(this.config.typingDuration)
    this._isTyping = false

    // Имитация задержки ответа (200-500ms как указано в требованиях)
    const responseDelay = Math.random() * 300 + 200
    await this.delay(responseDelay)

    // Поиск соответствующего шага в сценарии
    const step = this.findMatchingStep(message)

    if (step) {
      // Обновляем данные сценария кофейни и переключаем тему при выборе бизнес-режима
      if (message.toLowerCase().includes('ммб') || message.toLowerCase().includes('кб')) {
        this.coffeeShopScenario.theme = 'green'
        // Вызываем callback для смены темы в UI
        if (this.config.onThemeChange) {
          this.config.onThemeChange('green')
        }

        // Автоматически предлагаем следующий этап - форму сбора данных о локации
        const locationFormStep = this.currentScenario.steps.find(s =>
          s.trigger.toString().includes('локация') || s.trigger.toString().includes('город')
        )

        if (locationFormStep) {
          // Сохраняем reasoning-сообщение из текущего шага
          const reasoningMessage = this.createAgentMessage(step)

          // Создаем текстовое сообщение о переходе к форме локации как дополнительную информацию
          const locationFormTextMessage = `\n\n${locationFormStep.response}`

          return {
            message: step.response + locationFormTextMessage,
            type: 'text', // Оставляем тип 'text' для совместимости с AgentResponse
            actions: locationFormStep.actions,
            metadata: {
              messageType: reasoningMessage.type, // Сохраняем тип reasoning в metadata
              messageData: reasoningMessage // Сохраняем reasoning-сообщение в metadata
            }
          }
        }
      }

      // Создаем сообщение агента
      const agentMessage = this.createAgentMessage(step)

      return {
        message: step.response,
        type: 'text',
        actions: step.actions,
        metadata: {
          messageType: agentMessage.type,
          messageData: agentMessage
        }
      }
    }

    // Ответ по умолчанию
    return {
      message: "Я готов помочь вам с вопросами открытия кофейни! Расскажите, на каком этапе вы находитесь?",
      type: 'text',
      metadata: {
        messageType: 'text'
      }
    }
  }

  async startSession(theme: ThemeType): Promise<void> {
    console.log(`Starting session with theme: ${theme}`)
    this.coffeeShopScenario = {
      currentStep: 0,
      userData: {},
      theme: theme
    }
  }

  async endSession(): Promise<void> {
    console.log('Ending session')
    this.coffeeShopScenario = {
      currentStep: 0,
      userData: {},
      theme: 'purple'
    }
  }

  isTyping(): boolean {
    return this._isTyping
  }

  // Дополнительные методы для работы со сценарием
  getCurrentScenario(): CoffeeShopScenario {
    return this.coffeeShopScenario
  }

  updateUserData(data: Partial<CoffeeShopScenario['userData']>): void {
    this.coffeeShopScenario.userData = {
      ...this.coffeeShopScenario.userData,
      ...data
    }
  }

  setTheme(theme: ThemeType): void {
    this.coffeeShopScenario.theme = theme
    // Вызываем callback для смены темы в UI
    if (this.config.onThemeChange) {
      this.config.onThemeChange(theme)
    }
  }

  // Метод для принудительной смены темы при выборе бизнес-режима
  setBusinessMode(isBusinessMode: boolean): void {
    const newTheme: ThemeType = isBusinessMode ? 'green' : 'purple'
    this.setTheme(newTheme)
  }
}