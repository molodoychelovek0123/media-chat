// Автоматизированный тест MockAgentService через Node.js
// Этот скрипт проверяет логику сценария без запуска React приложения

import { MockAgentService } from './src/services/agent/MockAgentService.js';

// Создаем упрощенную версию MockAgentService для тестирования
class TestMockAgentService {
  constructor() {
    this.service = new MockAgentService({
      responseDelay: 0,
      typingDuration: 0,
      errorRate: 0,
      onThemeChange: (theme) => {
        console.log(`🎨 Тема изменена на: ${theme}`);
      }
    });
  }

  async testScenario() {
    console.log('🧪 Начинаем автоматизированное тестирование сценария...\n');
    
    const testCases = [
      {
        name: 'Инициализация по слову "кофе"',
        input: 'Хочу открыть кофейню',
        expected: {
          hasButtons: true,
          buttonLabels: ['ММБ - Модель малого бизнеса', 'КБ - Консалтинг бизнеса'],
          messageContains: 'Отлично! Я готов помочь вам с открытием кофейни'
        }
      },
      {
        name: 'Выбор режима ММБ',
        input: 'ММБ',
        expected: {
          messageType: 'reasoning',
          themeChanged: 'green',
          messageContains: 'Отличный выбор!'
        }
      },
      {
        name: 'Сбор данных о локации',
        input: 'локация',
        expected: {
          messageType: 'form',
          messageContains: 'Понял! Давайте соберем информацию о локации'
        }
      },
      {
        name: 'Вопрос о городе',
        input: 'Москва',
        expected: {
          messageContains: 'В каком городе вы планируете открыть кофейню?'
        }
      },
      {
        name: 'Вопрос о типе локации',
        input: 'тип',
        expected: {
          messageType: 'quick-replies',
          messageContains: 'Какой тип локации вас интересует?'
        }
      },
      {
        name: 'Вопрос о конкурентах',
        input: 'конкуренты',
        expected: {
          messageContains: 'Расскажите о конкурентах в этом районе?'
        }
      },
      {
        name: 'Уведомление о заполнении',
        input: 'готово',
        expected: {
          messageType: 'quick-replies',
          messageContains: 'Отлично! Мы собрали всю необходимую информацию'
        }
      },
      {
        name: 'Финансовый анализ',
        input: 'финансовый',
        expected: {
          messageType: 'table',
          messageContains: 'Переходим к финансовому планированию'
        }
      },
      {
        name: 'Интерактивная карта',
        input: 'карта',
        expected: {
          messageType: 'map',
          messageContains: 'Отличная идея! Вот карта с потенциальными локациями'
        }
      },
      {
        name: 'Вопрос о расчетном счете',
        input: 'счет',
        expected: {
          messageType: 'button-group',
          messageContains: 'Нужен ли вам расчетный счет для бизнеса?'
        }
      },
      {
        name: 'Отказ от счета',
        input: 'нет',
        expected: {
          messageType: 'form',
          messageContains: 'Понял! Но если решите открыть счет позже'
        }
      }
    ];

    let passed = 0;
    let failed = 0;

    for (const testCase of testCases) {
      console.log(`\n📋 Тест: ${testCase.name}`);
      console.log(`   Ввод: "${testCase.input}"`);
      
      try {
        const response = await this.service.sendMessage(testCase.input);
        
        let testPassed = true;
        const errors = [];

        // Проверка содержания сообщения
        if (testCase.expected.messageContains && 
            !response.message.includes(testCase.expected.messageContains)) {
          testPassed = false;
          errors.push(`Сообщение не содержит ожидаемый текст: "${testCase.expected.messageContains}"`);
        }

        // Проверка типа сообщения
        if (testCase.expected.messageType && 
            response.metadata?.messageType !== testCase.expected.messageType) {
          testPassed = false;
          errors.push(`Ожидался тип сообщения: "${testCase.expected.messageType}", получен: "${response.metadata?.messageType}"`);
        }

        // Проверка кнопок
        if (testCase.expected.hasButtons && 
            (!response.actions || response.actions.length === 0)) {
          testPassed = false;
          errors.push('Ожидались кнопки, но они не найдены');
        }

        // Проверка меток кнопок
        if (testCase.expected.buttonLabels) {
          const actualLabels = response.actions?.map(a => a.label) || [];
          const missingLabels = testCase.expected.buttonLabels.filter(
            label => !actualLabels.includes(label)
          );
          if (missingLabels.length > 0) {
            testPassed = false;
            errors.push(`Отсутствуют кнопки: ${missingLabels.join(', ')}`);
          }
        }

        if (testPassed) {
          console.log('   ✅ УСПЕХ');
          passed++;
        } else {
          console.log('   ❌ ОШИБКА');
          errors.forEach(error => console.log(`      - ${error}`));
          failed++;
        }

        // Дополнительная информация для отладки
        console.log(`      Ответ: "${response.message.substring(0, 50)}..."`);
        if (response.metadata?.messageType) {
          console.log(`      Тип сообщения: ${response.metadata.messageType}`);
        }
        if (response.actions?.length > 0) {
          console.log(`      Кнопки: ${response.actions.map(a => a.label).join(', ')}`);
        }

      } catch (error) {
        console.log('   ❌ ОШИБКА ВЫПОЛНЕНИЯ');
        console.log(`      ${error.message}`);
        failed++;
      }
    }

    console.log('\n📊 ИТОГИ ТЕСТИРОВАНИЯ:');
    console.log(`   ✅ Успешно: ${passed}`);
    console.log(`   ❌ Ошибки: ${failed}`);
    console.log(`   📈 Общий результат: ${passed}/${testCases.length} (${Math.round(passed/testCases.length*100)}%)`);

    return { passed, failed, total: testCases.length };
  }
}

// Запускаем тестирование
const tester = new TestMockAgentService();
tester.testScenario().then(result => {
  if (result.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
});