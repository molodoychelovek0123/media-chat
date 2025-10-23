// Прямое тестирование MockAgentService через TypeScript
import { MockAgentService } from './src/services/agent/MockAgentService';
import { MockAgentConfig } from './src/types/agent';

async function testCoffeeScenario() {
  console.log('🧪 Начинаем прямое тестирование сценария открытия кофейни...\n');

  const config: MockAgentConfig = {
    responseDelay: 300,
    typingDuration: 1500,
    errorRate: 0.05,
    onThemeChange: (theme) => {
      console.log(`🎨 Тема изменена на: ${theme}`);
    }
  };

  const agentService = new MockAgentService(config);

  try {
    // Шаг 1: Инициализация сценария по слову "кофе"
    console.log('1. Тестируем инициализацию по слову "кофе"...');
    const response1 = await agentService.sendMessage('Хочу открыть кофейню');
    console.log('✅ Ответ агента:', response1.message);
    console.log('✅ Тип:', response1.type);
    console.log('✅ Действия:', response1.actions?.map(a => a.label));
    console.log('');

    // Шаг 2: Выбор режима ММБ
    console.log('2. Тестируем выбор режима ММБ...');
    const response2 = await agentService.sendMessage('ММБ');
    console.log('✅ Ответ агента:', response2.message);
    console.log('✅ Тип:', response2.type);
    console.log('✅ Metadata:', response2.metadata);
    console.log('');

    // Шаг 3: Сбор данных о локации
    console.log('3. Тестируем сбор данных о локации...');
    const response3 = await agentService.sendMessage('локация');
    console.log('✅ Ответ агента:', response3.message);
    console.log('✅ Тип:', response3.type);
    console.log('✅ Metadata:', response3.metadata);
    console.log('');

    // Шаг 4: Пошаговый сбор данных - город
    console.log('4. Тестируем вопрос о городе...');
    const response4 = await agentService.sendMessage('Москва');
    console.log('✅ Ответ агента:', response4.message);
    console.log('✅ Тип:', response4.type);
    console.log('');

    // Шаг 5: Пошаговый сбор данных - тип локации
    console.log('5. Тестируем вопрос о типе локации...');
    const response5 = await agentService.sendMessage('тип');
    console.log('✅ Ответ агента:', response5.message);
    console.log('✅ Тип:', response5.type);
    console.log('✅ Metadata:', response5.metadata);
    console.log('');

    // Шаг 6: Пошаговый сбор данных - конкуренты
    console.log('6. Тестируем вопрос о конкурентах...');
    const response6 = await agentService.sendMessage('конкуренты');
    console.log('✅ Ответ агента:', response6.message);
    console.log('✅ Тип:', response6.type);
    console.log('');

    // Шаг 7: Уведомление о заполнении формы
    console.log('7. Тестируем уведомление о заполнении...');
    const response7 = await agentService.sendMessage('готово');
    console.log('✅ Ответ агента:', response7.message);
    console.log('✅ Тип:', response7.type);
    console.log('✅ Metadata:', response7.metadata);
    console.log('');

    // Шаг 8: Финансовый анализ
    console.log('8. Тестируем финансовый анализ...');
    const response8 = await agentService.sendMessage('финансовый');
    console.log('✅ Ответ агента:', response8.message);
    console.log('✅ Тип:', response8.type);
    console.log('✅ Metadata:', response8.metadata);
    console.log('');

    // Шаг 9: Интерактивная карта
    console.log('9. Тестируем интерактивную карту...');
    const response9 = await agentService.sendMessage('карта');
    console.log('✅ Ответ агента:', response9.message);
    console.log('✅ Тип:', response9.type);
    console.log('✅ Metadata:', response9.metadata);
    console.log('');

    // Шаг 10: Вопрос о расчетном счете
    console.log('10. Тестируем вопрос о расчетном счете...');
    const response10 = await agentService.sendMessage('счет');
    console.log('✅ Ответ агента:', response10.message);
    console.log('✅ Тип:', response10.type);
    console.log('✅ Metadata:', response10.metadata);
    console.log('');

    // Шаг 11: Отказ от счета
    console.log('11. Тестируем отказ от счета...');
    const response11 = await agentService.sendMessage('нет');
    console.log('✅ Ответ агента:', response11.message);
    console.log('✅ Тип:', response11.type);
    console.log('✅ Metadata:', response11.metadata);
    console.log('');

    console.log('🎉 Все шаги сценария успешно протестированы!');

    // Проверяем состояние сценария
    const scenario = agentService.getCurrentScenario();
    console.log('\n📊 Текущее состояние сценария:');
    console.log('Тема:', scenario.theme);
    console.log('Данные пользователя:', scenario.userData);

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  }
}

// Запускаем тестирование
testCoffeeScenario();