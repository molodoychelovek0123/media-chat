// Тестовый скрипт для проверки исправления перехода от reasoning к форме
import { MockAgentService } from './src/services/agent/MockAgentService.js';

// Создаем mock конфиг
const mockConfig = {
  typingDuration: 100,
  onThemeChange: (theme) => console.log(`Тема изменена на: ${theme}`)
};

// Создаем экземпляр сервиса
const agentService = new MockAgentService(mockConfig);

// Тестируем полный сценарий
async function testFullScenario() {
  console.log('🧪 Тестирование полного сценария с переходом от reasoning к форме\n');
  
  // Шаг 1: Инициализация сценария
  console.log('1. Пользователь: "хочу открыть кофейню"');
  let response = await agentService.sendMessage('хочу открыть кофейню');
  console.log('   Агент:', response.message.substring(0, 50) + '...');
  console.log('   Тип сообщения:', response.metadata?.messageType);
  console.log('   Действия:', response.actions?.map(a => a.label).join(', '));
  console.log('');
  
  // Шаг 2: Выбор режима ММБ (должен показать reasoning)
  console.log('2. Пользователь: "ММБ"');
  response = await agentService.sendMessage('ММБ');
  console.log('   Агент:', response.message.substring(0, 50) + '...');
  console.log('   Тип сообщения:', response.metadata?.messageType);
  console.log('   Действия:', response.actions?.map(a => a.label).join(', '));
  console.log('');
  
  // Шаг 3: После reasoning должна автоматически показаться форма
  console.log('3. Проверяем автоматический переход к форме...');
  console.log('   Тип сообщения:', response.metadata?.messageType);
  console.log('   Данные формы:', response.metadata?.messageData?.messageType === 'form' ? 'ФОРМА ПОКАЗАНА ✅' : 'ФОРМА НЕ ПОКАЗАНА ❌');
  
  if (response.metadata?.messageData?.messageType === 'form') {
    console.log('   ✅ УСПЕХ: Форма автоматически показана после reasoning!');
    console.log('   Заголовок формы:', response.metadata.messageData.title);
    console.log('   Поля формы:', response.metadata.messageData.fields?.map(f => f.label).join(', '));
  } else {
    console.log('   ❌ ОШИБКА: Форма не показана после reasoning!');
  }
}

// Запускаем тест
testFullScenario().catch(console.error);