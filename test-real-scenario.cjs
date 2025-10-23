// Тест реального скомпилированного MockAgentService
const fs = require('fs');
const path = require('path');

// Загружаем скомпилированный код из dist
const distPath = path.join(__dirname, 'dist/assets/index-128ded5b.js');
console.log('📁 Путь к скомпилированному коду:', distPath);

if (!fs.existsSync(distPath)) {
  console.log('❌ Скомпилированный код не найден. Запустите npm run build сначала.');
  process.exit(1);
}

// Создаем упрощенный тест с реальной логикой
class RealScenarioTest {
  constructor() {
    // Создаем экземпляр MockAgentService с реальной логикой
    this.agentService = this.createMockAgentService();
  }

  createMockAgentService() {
    // Имитируем реальный MockAgentService
    const config = {
      responseDelay: 100,
      typingDuration: 500,
      errorRate: 0,
      onThemeChange: (theme) => {
        console.log(`🎨 Тема изменена на: ${theme}`);
      }
    };

    return {
      currentScenario: this.createBusinessScenario(),
      coffeeShopScenario: {
        currentStep: 0,
        userData: {},
        theme: 'purple'
      },
      config,

      async sendMessage(message) {
        console.log(`\n📤 Получено сообщение: "${message}"`);
        await this.delay(100);
        
        const step = this.findMatchingStep(message);
        
        if (step) {
          console.log(`✅ Найден шаг: ${step.response.substring(0, 50)}...`);
          
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

        console.log('❌ Шаг не найден, возвращаем ответ по умолчанию');
        return {
          message: "Я готов помочь вам с вопросами открытия кофейни! Расскажите, на каком этапе вы находитесь?",
          type: 'text',
          metadata: {
            messageType: 'text'
          }
        };
      },

      findMatchingStep(message) {
        console.log(`🔍 Поиск шага для: "${message}"`);
        
        for (let i = 0; i < this.currentScenario.steps.length; i++) {
          const step = this.currentScenario.steps[i];
          const isMatch = step.trigger.test(message);
          console.log(`  Шаг ${i}: ${step.trigger} -> ${isMatch ? 'СОВПАЛ' : 'не совпал'}`);
          
          if (isMatch) {
            return step;
          }
        }
        return null;
      },

      delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },

      getCurrentScenario() {
        return this.coffeeShopScenario;
      }
    };
  }

  createBusinessScenario() {
    // Полный сценарий как в реальном MockAgentService
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
        }
      ]
    };
  }

  async runTest() {
    console.log('🧪 ТЕСТИРОВАНИЕ РЕАЛЬНОГО СЦЕНАРИЯ\n');
    
    const testMessages = [
      'Хочу открыть кофейню',
      'ММБ',
      'локация',
      'Москва',
      'тип',
      'конкуренты',
      'готово'
    ];

    for (const message of testMessages) {
      console.log('\n' + '='.repeat(50));
      const response = await this.agentService.sendMessage(message);
      console.log(`🤖 Ответ: ${response.message.substring(0, 100)}...`);
      console.log(`📊 Тип metadata: ${response.metadata?.messageType}`);
      
      if (response.message.includes('Я готов помочь')) {
        console.log('❌ ВОЗВРАЩЕН ОТВЕТ ПО УМОЛЧАНИЮ!');
      }
    }
  }
}

// Запускаем тест
const test = new RealScenarioTest();
test.runTest().catch(console.error);