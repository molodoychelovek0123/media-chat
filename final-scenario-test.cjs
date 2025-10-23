
// ФИНАЛЬНЫЙ ТЕСТ СЦЕНАРИЯ - ИСПРАВЛЕННАЯ ВЕРСИЯ

class FixedMockAgentService {
  constructor(config) {
    this.config = config;
    this.currentScenario = this.createBusinessScenario();
    this.coffeeShopScenario = {
      currentStep: 0,
      userData: {},
      theme: 'purple'
    };
  }

  createBusinessScenario() {
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
        // Шаг 3: Форма для сбора информации о локации
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
        // Шаг 4: Пошаговый сбор данных - город
        {
          trigger: /.*город.*|.*москва.*|.*санкт-петербург.*|.*екатеринбург.*/i,
          response: "В каком городе вы планируете открыть кофейню?",
          messageType: 'text'
        },
        // Шаг 5: Пошаговый сбор данных - тип локации
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
        // Шаг 6: Пошаговый сбор данных - конкуренты
        {
          trigger: /.*конкуренты.*|.*соперники.*|.*конкуренция.*/i,
          response: "Расскажите о конкурентах в этом районе?",
          messageType: 'text'
        },
        // Шаг 7: Уведомление о заполнении формы
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
        // Шаг 8: Финансовый анализ
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
        // Шаг 9: Интерактивная карта с возможными местами
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
              }
            ],
            height: 400,
            width: 600,
            interactive: true
          }
        },
        // Шаг 10: Вопрос о расчетном счете
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
        // Шаг 11: Отказ от счета
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
    };
  }

  findMatchingStep(message) {
    for (let i = 0; i < this.currentScenario.steps.length; i++) {
      const step = this.currentScenario.steps[i];
      if (step.trigger.test(message)) {
        return step;
      }
    }
    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendMessage(message) {
    await this.delay(100);
    
    const step = this.findMatchingStep(message);
    
    if (step) {
      // Обновляем тему при выборе бизнес-режима
      if (message.toLowerCase().includes('ммб') || message.toLowerCase().includes('кб')) {
        this.coffeeShopScenario.theme = 'green';
        if (this.config.onThemeChange) {
          this.config.onThemeChange('green');
        }
      }

      const agentMessage = {
        id: `msg-${Date.now()}`,
        type: step.messageType || 'text',
        ...(step.messageData || {}),
        timestamp: new Date(),
        sender: 'agent',
        status: 'sent'
      };

      return {
        message: step.response,
        type: 'text',
        actions: step.actions,
        metadata: {
          messageType: agentMessage.type,
          messageData: agentMessage
        }
      };
    }

    // Ответ по умолчанию
    return {
      message: "Я готов помочь вам с вопросами открытия кофейни! Расскажите, на каком этапе вы находитесь?",
      type: 'text',
      metadata: {
        messageType: 'text'
      }
    };
  }

  getCurrentScenario() {
    return this.coffeeShopScenario;
  }
}

class FinalScenarioTest {
  constructor() {
    this.agentService = new FixedMockAgentService({
      responseDelay: 100,
      typingDuration: 500,
      errorRate: 0,
      onThemeChange: (theme) => {
        console.log(`🎨 Тема изменена на: ${theme}`);
      }
    });
    this.testResults = [];
    this.currentStep = 0;
  }

  async runFullScenario() {
    console.log('🧪 ФИНАЛЬНЫЙ ТЕСТ ПОЛНОГО СЦЕНАРИЯ\n');
    console.log('='.repeat(80));

    try {
      // Полная последовательность шагов
      const steps = [
        { name: 'Инициализация сценария', input: 'Хочу открыть кофейню', expected: 'Отлично! Я готов помочь вам с открытием кофейни!' },
        { name: 'Выбор режима ММБ', input: 'ММБ', expected: 'Отличный выбор! Давайте перейдем к детальному анализу вашего проекта.', metadata: 'reasoning' },
        { name: 'Форма локации', input: 'локация', expected: 'Понял! Давайте соберем информацию о локации вашей будущей кофейни.', metadata: 'form' },
        { name: 'Вопрос о городе', input: 'Москва', expected: 'В каком городе вы планируете открыть кофейню?', metadata: 'text' },
        { name: 'Вопрос о типе локации', input: 'тип', expected: 'Какой тип локации вас интересует?', metadata: 'quick-replies' },
        { name: 'Вопрос о конкурентах', input: 'конкуренты', expected: 'Расскажите о конкурентах в этом районе?', metadata: 'text' },
        { name: 'Уведомление о заполнении', input: 'готово', expected: 'Отлично! Мы собрали всю необходимую информацию о локации.', metadata: 'quick-replies' },
        { name: 'Финансовый анализ', input: 'финансовый', expected: 'Переходим к финансовому планированию.', metadata: 'table' },
        { name: 'Интерактивная карта', input: 'карта', expected: 'Отличная идея! Вот карта с потенциальными локациями', metadata: 'map' },
        { name: 'Вопрос о расчетном счете', input: 'счет', expected: 'Нужен ли вам расчетный счет для бизнеса?', metadata: 'button-group' },
        { name: 'Отказ от счета', input: 'нет', expected: 'Понял! Но если решите открыть счет позже, мы поможем.', metadata: 'form' }
      ];

      for (const step of steps) {
        await this.testStep(step.name, step.input, step.expected, step.metadata);
      }

      // Проверяем финальное состояние
      await this.checkFinalState();

      // Выводим итоговый отчет
      this.printTestReport();

    } catch (error) {
      console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error);
      this.printTestReport();
    }
  }

  async testStep(stepName, userInput, expectedMessage, expectedMetadata) {
    this.currentStep++;
    console.log(`\n${this.currentStep}. ${stepName}`);
    console.log('-'.repeat(40));
    console.log(`📤 Пользователь: "${userInput}"`);

    try {
      const response = await this.agentService.sendMessage(userInput);
      
      console.log(`🤖 Агент: "${response.message}"`);
      console.log(`📊 Тип metadata: ${response.metadata?.messageType}`);

      const stepResult = {
        step: this.currentStep,
        name: stepName,
        userInput,
        success: true,
        issues: []
      };

      // Проверка ожидаемого сообщения
      if (expectedMessage && !response.message.includes(expectedMessage)) {
        stepResult.success = false;
        stepResult.issues.push(`Сообщение не содержит ожидаемый текст: "${expectedMessage}"`);
      }

      // Проверка ожидаемого типа metadata
      if (expectedMetadata && response.metadata?.messageType !== expectedMetadata) {
        stepResult.success = false;
        stepResult.issues.push(`Ожидался тип сообщения: "${expectedMetadata}", получен: "${response.metadata?.messageType}"`);
      }

      this.testResults.push(stepResult);

      if (stepResult.success) {
        console.log('✅ Шаг выполнен успешно');
      } else {
        console.log('❌ Проблемы в шаге:', stepResult.issues.join(', '));
      }

      return response;

    } catch (error) {
      console.error('❌ Ошибка выполнения шага:', error);
      this.testResults.push({
        step: this.currentStep,
        name: stepName,
        userInput,
        success: false,
        issues: [`Ошибка выполнения: ${error.message}`]
      });
      throw error;
    }
  }

  async checkFinalState() {
    console.log('\n📊 Проверка финального состояния сценария...');
    
    const scenario = this.agentService.getCurrentScenario();
    console.log('Тема:', scenario.theme);
    
    // Проверяем, что тема изменилась на бизнес-режим
    if (scenario.theme !== 'green') {
      console.log('❌ Тема не изменилась на бизнес-режим (green)');
      this.testResults.push({
        step: 'final',
        name: 'Проверка темы',
        success: false,
        issues: ['Тема не изменилась на бизнес-режим']
      });
    } else {
      console.log('✅ Тема успешно изменена на бизнес-режим');
      this.testResults.push({
        step: 'final',
        name: 'Проверка темы',
        success: true,
        issues: []
      });
    }
  }

  printTestReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📋 ФИ