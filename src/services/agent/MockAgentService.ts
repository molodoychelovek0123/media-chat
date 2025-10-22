import { AgentService, AgentResponse, MockAgentConfig, BusinessScenario, BusinessScenarioStep, CoffeeShopScenario } from '@/types/agent'
import { Message, TextMessage } from '@/types/chat'
import { ThemeType } from '@/types/theme'

export class MockAgentService implements AgentService {
  private currentScenario: BusinessScenario
  private coffeeShopScenario: CoffeeShopScenario
  private step: number = 0
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
        // Начало сценария - выбор режима
        {
          trigger: /.*кофейн.*|.*кафе.*|.*кофе.*/i,
          response: "Отлично! Открытие кофейни - прекрасная идея! 🎯\n\nДавайте выберем подходящий режим консультации:",
          actions: [
            { type: 'button', label: 'ММБ - Модель малого бизнеса', payload: 'mmb' },
            { type: 'button', label: 'КБ - Консалтинг бизнеса', payload: 'kb' }
          ]
        },
        // Выбор режима ММБ
        {
          trigger: /.*ммб.*/i,
          response: "Отличный выбор! Модель малого бизнеса идеально подходит для старта кофейни. 🚀\n\nДавайте перейдем к детальному анализу вашего проекта.",
          messageType: 'reasoning',
          messageData: {
            steps: [
              {
                id: '1',
                content: 'Пользователь выбрал ММБ режим для открытия кофейни',
                timestamp: new Date()
              },
              {
                id: '2',
                content: 'ММБ подходит для проектов с инвестициями до 5 млн рублей',
                timestamp: new Date()
              },
              {
                id: '3',
                content: 'Начинаем анализ ключевых параметров бизнеса',
                timestamp: new Date()
              }
            ]
          }
        },
        // Выбор режима КБ
        {
          trigger: /.*кб.*/i,
          response: "Консалтинг бизнеса выбран! Этот режим подходит для более масштабных проектов. 📊\n\nПриступим к комплексному анализу.",
          messageType: 'reasoning',
          messageData: {
            steps: [
              {
                id: '1',
                content: 'Пользователь выбрал КБ режим для открытия кофейни',
                timestamp: new Date()
              },
              {
                id: '2',
                content: 'КБ подходит для проектов с инвестициями от 5 млн рублей',
                timestamp: new Date()
              },
              {
                id: '3',
                content: 'Начинаем детальный анализ всех аспектов бизнеса',
                timestamp: new Date()
              }
            ]
          }
        },
        // Сбор данных о локации
        {
          trigger: /.*локаци.*|.*местоположен.*|.*город.*/i,
          response: "Понял! Локация - ключевой фактор успеха кофейни. 🗺️\n\nПожалуйста, укажите планируемое местоположение:",
          messageType: 'form',
          messageData: {
            title: 'Информация о локации',
            fields: [
              {
                id: 'location',
                type: 'text',
                label: 'Город/Район',
                placeholder: 'Например: Москва, центр',
                required: true
              },
              {
                id: 'areaType',
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
        // Финансовый анализ
        {
          trigger: /.*бюджет.*|.*инвестици.*|.*финанс.*/i,
          response: "Переходим к финансовому планированию. 💰\n\nДавайте рассчитаем основные показатели:",
          messageType: 'table',
          messageData: {
            title: 'Финансовый план кофейни (первый год)',
            columns: [
              { key: 'category', label: 'Категория', align: 'left' },
              { key: 'amount', label: 'Сумма (руб)', align: 'right' },
              { key: 'description', label: 'Описание', align: 'left' }
            ],
            data: [
              { category: 'Стартовые инвестиции', amount: '2,500,000', description: 'Ремонт, оборудование, мебель' },
              { category: 'Ежемесячные расходы', amount: '350,000', description: 'Аренда, зарплаты, сырье' },
              { category: 'Прогноз выручки', amount: '600,000', description: 'При 200 клиентах в день' },
              { category: 'Чистая прибыль', amount: '250,000', description: 'После всех расходов' },
              { category: 'Окупаемость', amount: '10 месяцев', description: 'Срок возврата инвестиций' }
            ]
          }
        },
        // Визуализация планировки
        {
          trigger: /.*план.*|.*дизайн.*|.*интерьер.*/i,
          response: "Отличная идея! Планировка кофейни влияет на эффективность работы. 🏗️\n\nВот пример оптимальной планировки:",
          messageType: 'image',
          messageData: {
            imageUrl: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Планировка+кофейни',
            altText: 'Пример планировки кофейни',
            caption: 'Оптимальная планировка на 40-50 посадочных мест',
            width: 600,
            height: 400
          }
        },
        // Полезные ресурсы
        {
          trigger: /.*ресурс.*|.*ссылки.*|.*помощь.*/i,
          response: "Вот полезные ресурсы для открытия кофейни: 📚",
          messageType: 'links',
          messageData: {
            title: 'Полезные материалы',
            links: [
              {
                id: '1',
                title: 'Бизнес-план кофейни',
                url: 'https://example.com/business-plan',
                description: 'Подробный шаблон бизнес-плана',
                domain: 'example.com'
              },
              {
                id: '2',
                title: 'Руководство по выбору оборудования',
                url: 'https://example.com/equipment',
                description: 'Как выбрать кофемашину и другое оборудование',
                domain: 'example.com'
              },
              {
                id: '3',
                title: 'Маркетинг для кофейни',
                url: 'https://example.com/marketing',
                description: 'Стратегии продвижения в соцсетях',
                domain: 'example.com'
              },
              {
                id: '4',
                title: 'Юридические аспекты',
                url: 'https://example.com/legal',
                description: 'Регистрация бизнеса и лицензии',
                domain: 'example.com'
              }
            ],
            layout: 'grid'
          }
        },
        // Карта с потенциальными локациями
        {
          trigger: /.*карт.*|.*карта.*|.*локации.*|.*места.*/i,
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
        // Прогресс анализа
        {
          trigger: /.*прогресс.*|.*статус.*|.*готовность.*/i,
          response: "Отслеживаем прогресс анализа вашего проекта: 📈",
          messageType: 'progress',
          messageData: {
            title: 'Анализ проекта кофейни',
            progress: 75,
            max: 100,
            progressStatus: 'running',
            description: 'Завершены: концепция, финансы, локация. Осталось: маркетинг, найм',
            showPercentage: true
          }
        },
        // Быстрые ответы для продолжения
        {
          trigger: /.*дальше.*|.*продолжить.*|.*следующий.*/i,
          response: "Продолжаем анализ! Что вас интересует?",
          messageType: 'quick-replies',
          messageData: {
            suggestions: [
              'Маркетинговая стратегия',
              'Подбор персонала',
              'Юридические вопросы',
              'Техническое оснащение',
              'Финансовые расчеты'
            ],
            maxVisible: 5
          }
        }
      ]
    }
  }

  private findMatchingStep(message: string): BusinessScenarioStep | null {
    for (let i = this.step; i < this.currentScenario.steps.length; i++) {
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
      this.step++
      
      // Обновляем данные сценария кофейни и переключаем тему при выборе бизнес-режима
      if (message.toLowerCase().includes('ммб') || message.toLowerCase().includes('кб')) {
        this.coffeeShopScenario.theme = 'green'
        // Вызываем callback для смены темы в UI
        if (this.config.onThemeChange) {
          this.config.onThemeChange('green')
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
    this.step = 0
    this.coffeeShopScenario = {
      currentStep: 0,
      userData: {},
      theme: theme
    }
  }

  async endSession(): Promise<void> {
    console.log('Ending session')
    this.step = 0
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