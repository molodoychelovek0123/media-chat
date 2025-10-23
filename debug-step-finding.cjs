// Детальный тест для отладки поиска шагов в MockAgentService

class TestMockAgentService {
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
        }
      ]
    };
  }

  findMatchingStep(message) {
    console.log(`\n🔍 Поиск шага для сообщения: "${message}"`);
    console.log(`Всего шагов в сценарии: ${this.currentScenario.steps.length}`);
    
    for (let i = 0; i < this.currentScenario.steps.length; i++) {
      const step = this.currentScenario.steps[i];
      console.log(`\nПроверка шага ${i}:`);
      console.log(`  Триггер: ${step.trigger}`);
      console.log(`  Ответ: ${step.response.substring(0, 50)}...`);
      
      try {
        const isMatch = step.trigger.test(message);
        console.log(`  Результат теста: ${isMatch ? '✅ СОВПАЛ' : '❌ не совпал'}`);
        
        if (isMatch) {
          console.log(`🎯 Найден шаг ${i}: ${step.response.substring(0, 50)}...`);
          return step;
        }
      } catch (error) {
        console.log(`  ❌ Ошибка при тестировании триггера: ${error.message}`);
      }
    }
    
    console.log(`❌ Шаг не найден для сообщения: "${message}"`);
    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendMessage(message) {
    console.log(`\n📤 Получено сообщение: "${message}"`);
    await this.delay(100);
    
    const step = this.findMatchingStep(message);
    
    if (step) {
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
}

async function debugStepFinding() {
  console.log('🐛 ДЕТАЛЬНАЯ ОТЛАДКА ПОИСКА ШАГОВ\n');
  
  const agentService = new TestMockAgentService({
    responseDelay: 100,
    typingDuration: 500,
    errorRate: 0
  });

  // Тестируем проблемные сообщения
  const testMessages = [
    'Москва',
    'тип',
    'конкуренты',
    'готово'
  ];

  for (const message of testMessages) {
    console.log('\n' + '='.repeat(60));
    const response = await agentService.sendMessage(message);
    console.log(`\n🤖 Ответ: ${response.message.substring(0, 100)}...`);
    console.log(`📊 Тип metadata: ${response.metadata?.messageType}`);
    
    if (response.message.includes('Я готов помочь')) {
      console.log('❌ ВОЗВРАЩЕН ОТВЕТ ПО УМОЛЧАНИЮ!');
    }
  }
}

debugStepFinding().catch(console.error);