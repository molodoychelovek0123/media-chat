// Тест реального MockAgentService с TypeScript
import { MockAgentService } from './src/services/agent/MockAgentService';
import { MockAgentConfig } from './src/types/agent';

async function testRealService() {
  console.log('🧪 ТЕСТИРОВАНИЕ РЕАЛЬНОГО MOCKAGENTSERVICE\n');
  
  const config: MockAgentConfig = {
    responseDelay: 100,
    typingDuration: 500,
    errorRate: 0,
    onThemeChange: (theme) => {
      console.log(`🎨 Тема изменена на: ${theme}`);
    }
  };

  const agentService = new MockAgentService(config);

  // Тестируем последовательность шагов
  const testMessages = [
    'Хочу открыть кофейню',
    'ММБ',
    'локация',
    'Москва',
    'тип'
  ];

  for (const message of testMessages) {
    console.log('\n' + '='.repeat(50));
    console.log(`📤 Пользователь: "${message}"`);
    
    const response = await agentService.sendMessage(message);
    
    console.log(`🤖 Ответ: ${response.message.substring(0, 100)}...`);
    console.log(`📊 Тип metadata: ${response.metadata?.messageType}`);
    
    if (!response.metadata?.messageData) {
      console.log('❌ Нет messageData в metadata!');
    }
  }
}

testRealService().catch(console.error);