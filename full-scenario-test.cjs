// Автоматизированный скрипт проверки полного прохода сценария
// Проверяет каждый шаг от инициализации до открытия расчетного счета

// Временный упрощенный тест для проверки логики MockAgentService
// Используем прямое создание экземпляра для тестирования

// Создаем упрощенную версию MockAgentService для тестирования
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
        }
      ]
    };
  }

  findMatchingStep(message) {
    for (let i = 0; i < this.currentScenario.steps.length; i++) {
      if (this.currentScenario.steps[i].trigger.test(message)) {
        return this.currentScenario.steps[i];
      }
    }
    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendMessage(message) {
    await this.delay(300);
    
    const step = this.findMatchingStep(message);
    
    if (step) {
      // Обновляем данные сценария кофейни и переключаем тему при выборе бизнес-режима
      if (message.toLowerCase().includes('ммб') || message.toLowerCase().includes('кб')) {
        this.coffeeShopScenario.theme = 'green';
        if (this.config.onThemeChange) {
          this.config.onThemeChange('green');
        }

        // Автоматически предлагаем следующий этап - форму сбора данных о локации
        const locationFormStep = this.currentScenario.steps.find(s =>
          s.trigger.toString().includes('локация') || s.trigger.toString().includes('город')
        );

        if (locationFormStep) {
          // Сохраняем reasoning-сообщение из текущего шага
          const reasoningMessage = {
            id: `msg-${Date.now()}`,
            type: step.messageType,
            ...step.messageData,
            timestamp: new Date(),
            sender: 'agent',
            status: 'sent'
          };

          // Создаем текстовое сообщение о переходе к форме локации как дополнительную информацию
          const locationFormTextMessage = `\n\n${locationFormStep.response}`;

          return {
            message: step.response + locationFormTextMessage,
            type: 'text',
            actions: locationFormStep.actions,
            metadata: {
              messageType: reasoningMessage.type,
              messageData: reasoningMessage
            }
          };
        }
      }

      // Создаем сообщение агента
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

const MockAgentService = TestMockAgentService;

class ScenarioTestRunner {
  constructor() {
    this.agentService = new MockAgentService({
      responseDelay: 300,
      typingDuration: 1500,
      errorRate: 0.05,
      onThemeChange: (theme) => {
        console.log(`🎨 Тема изменена на: ${theme}`);
      }
    });
    this.testResults = [];
    this.currentStep = 0;
  }

  async runFullScenario() {
    console.log('🧪 ЗАПУСК ПОЛНОГО ТЕСТИРОВАНИЯ СЦЕНАРИЯ\n');
    console.log('='.repeat(80));

    try {
      // Шаг 1: Инициализация сценария по слову "кофе"
      await this.testStep('Инициализация сценария', 'Хочу открыть кофейню', {
        expectedMessage: 'Отлично! Я готов помочь вам с открытием кофейни!',
        expectedActions: ['ММБ - Модель малого бизнеса', 'КБ - Консалтинг бизнеса']
      });

      // Шаг 2: Выбор режима ММБ (должен показать reasoning)
      await this.testStep('Выбор режима ММБ', 'ММБ', {
        expectedMessage: 'Отличный выбор! Давайте перейдем к детальному анализу вашего проекта.',
        expectedMetadata: 'reasoning',
        checkReasoning: true
      });

      // Шаг 3: Проверка автоматического перехода к форме локации
      // После reasoning должна автоматически показываться форма
      await this.testStep('Автоматический переход к форме локации', 'локация', {
        expectedMessage: 'Понял! Давайте соберем информацию о локации вашей будущей кофейни.',
        expectedMetadata: 'form',
        checkForm: true
      });

      // Шаг 4: Пошаговый сбор данных - город
      await this.testStep('Вопрос о городе', 'Москва', {
        expectedMessage: 'В каком городе вы планируете открыть кофейню?'
      });

      // Шаг 5: Пошаговый сбор данных - тип локации
      await this.testStep('Вопрос о типе локации', 'тип', {
        expectedMessage: 'Какой тип локации вас интересует?',
        expectedMetadata: 'quick-replies'
      });

      // Шаг 6: Пошаговый сбор данных - конкуренты
      await this.testStep('Вопрос о конкурентах', 'конкуренты', {
        expectedMessage: 'Расскажите о конкурентах в этом районе?'
      });

      // Шаг 7: Уведомление о заполнении формы
      await this.testStep('Уведомление о заполнении', 'готово', {
        expectedMessage: 'Отлично! Мы собрали всю необходимую информацию о локации.',
        expectedMetadata: 'quick-replies'
      });

      // Шаг 8: Финансовый анализ
      await this.testStep('Финансовый анализ', 'финансовый', {
        expectedMessage: 'Переходим к финансовому планированию.',
        expectedMetadata: 'table'
      });

      // Шаг 9: Интерактивная карта
      await this.testStep('Интерактивная карта', 'карта', {
        expectedMessage: 'Отличная идея! Вот карта с потенциальными локациями',
        expectedMetadata: 'map'
      });

      // Шаг 10: Вопрос о расчетном счете
      await this.testStep('Вопрос о расчетном счете', 'счет', {
        expectedMessage: 'Нужен ли вам расчетный счет для бизнеса?',
        expectedMetadata: 'button-group'
      });

      // Шаг 11: Отказ от счета
      await this.testStep('Отказ от счета', 'нет', {
        expectedMessage: 'Понял! Но если решите открыть счет позже, мы поможем.',
        expectedMetadata: 'form'
      });

      // Проверяем финальное состояние сценария
      await this.checkFinalState();

      // Выводим итоговый отчет
      this.printTestReport();

    } catch (error) {
      console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error);
      this.printTestReport();
    }
  }

  async testStep(stepName, userInput, expectations) {
    this.currentStep++;
    console.log(`\n${this.currentStep}. ${stepName}`);
    console.log('-'.repeat(40));
    console.log(`📤 Пользователь: "${userInput}"`);

    try {
      const response = await this.agentService.sendMessage(userInput);
      
      console.log(`🤖 Агент: "${response.message}"`);
      console.log(`📊 Тип: ${response.type}`);
      console.log(`🔍 Metadata:`, response.metadata);

      // Проверяем ожидания
      const stepResult = {
        step: this.currentStep,
        name: stepName,
        userInput,
        success: true,
        issues: []
      };

      // Проверка ожидаемого сообщения
      if (expectations.expectedMessage && !response.message.includes(expectations.expectedMessage)) {
        stepResult.success = false;
        stepResult.issues.push(`Сообщение не содержит ожидаемый текст: "${expectations.expectedMessage}"`);
      }

      // Проверка ожидаемого типа metadata
      if (expectations.expectedMetadata && response.metadata?.messageType !== expectations.expectedMetadata) {
        stepResult.success = false;
        stepResult.issues.push(`Ожидался тип сообщения: "${expectations.expectedMetadata}", получен: "${response.metadata?.messageType}"`);
      }

      // Проверка действий (кнопок)
      if (expectations.expectedActions) {
        const actualActions = response.actions?.map(a => a.label) || [];
        const missingActions = expectations.expectedActions.filter(action => 
          !actualActions.includes(action)
        );
        if (missingActions.length > 0) {
          stepResult.success = false;
          stepResult.issues.push(`Отсутствуют действия: ${missingActions.join(', ')}`);
        }
      }

      // Проверка reasoning
      if (expectations.checkReasoning && response.metadata?.messageType !== 'reasoning') {
        stepResult.success = false;
        stepResult.issues.push('Reasoning-сообщение не создано');
      }

      // Проверка формы
      if (expectations.checkForm && response.metadata?.messageType !== 'form') {
        stepResult.success = false;
        stepResult.issues.push('Форма не создана');
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
    console.log('Данные пользователя:', scenario.userData);
    
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
    console.log('📋 ИТОГОВЫЙ ОТЧЕТ ТЕСТИРОВАНИЯ');
    console.log('='.repeat(80));

    const totalSteps = this.testResults.length;
    const successfulSteps = this.testResults.filter(r => r.success).length;
    const failedSteps = totalSteps - successfulSteps;

    console.log(`Всего шагов: ${totalSteps}`);
    console.log(`Успешных: ${successfulSteps}`);
    console.log(`Проваленных: ${failedSteps}`);
    console.log(`Успешность: ${((successfulSteps / totalSteps) * 100).toFixed(1)}%`);

    // Детальный отчет по шагам
    console.log('\n📝 Детальный отчет по шагам:');
    this.testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} Шаг ${result.step}: ${result.name}`);
      if (!result.success && result.issues.length > 0) {
        result.issues.forEach(issue => console.log(`   - ${issue}`));
      }
    });

    // Рекомендации
    if (failedSteps > 0) {
      console.log('\n🚨 РЕКОМЕНДАЦИИ ПО ИСПРАВЛЕНИЮ:');
      const failedResults = this.testResults.filter(r => !r.success);
      failedResults.forEach(result => {
        console.log(`• Шаг ${result.step} (${result.name}): ${result.issues.join(', ')}`);
      });
    } else {
      console.log('\n🎉 ВСЕ ШАГИ СЦЕНАРИЯ УСПЕШНО ПРОЙДЕНЫ!');
    }
  }
}

// Запуск тестирования
async function main() {
  const runner = new ScenarioTestRunner();
  await runner.runFullScenario();
}

// Экспорт для использования в других тестах
module.exports = { ScenarioTestRunner };

// Запускаем если файл выполняется напрямую
if (require.main === module) {
  main().catch(console.error);
}