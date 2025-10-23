// Анализ сценария открытия кофейни через прямое чтение файла
import fs from 'fs';

function analyzeCoffeeScenario() {
  console.log('🔍 Анализ сценария открытия кофейни...\n');

  try {
    // Читаем файл MockAgentService
    const fileContent = fs.readFileSync('./src/services/agent/MockAgentService.ts', 'utf8');
    
    // Анализируем шаги сценария
    const steps = extractScenarioSteps(fileContent);
    
    console.log('📋 Найденные шаги сценария:');
    steps.forEach((step, index) => {
      console.log(`\n${index + 1}. ${step.name}`);
      console.log(`   Триггер: ${step.trigger}`);
      console.log(`   Ответ: "${step.response.substring(0, 50)}..."`);
      if (step.messageType) {
        console.log(`   Тип сообщения: ${step.messageType}`);
      }
      if (step.actions && step.actions.length > 0) {
        console.log(`   Действия: ${step.actions.map(a => a.label).join(', ')}`);
      }
    });

    // Проверяем ключевые требования
    console.log('\n🧪 Проверка ключевых требований:');
    
    const requirements = [
      {
        name: 'Инициализация по слову "кофе"',
        check: () => steps.some(step => step.trigger.includes('кофе') && step.actions?.length > 0),
        description: 'Триггер "кофе" с кнопками выбора режима'
      },
      {
        name: 'Выбор режима ММБ/КБ',
        check: () => steps.some(step => step.trigger.includes('ммб') && step.messageType === 'reasoning'),
        description: 'Reasoning-сообщение при выборе ММБ'
      },
      {
        name: 'Форма сбора данных о локации',
        check: () => steps.some(step => step.messageType === 'form' && step.response.includes('локация')),
        description: 'Форма для сбора информации о локации'
      },
      {
        name: 'Пошаговый сбор данных',
        check: () => steps.filter(step => 
          step.response.includes('город') || 
          step.response.includes('тип') || 
          step.response.includes('конкуренты')
        ).length >= 3,
        description: 'Вопросы о городе, типе локации и конкурентах'
      },
      {
        name: 'Финансовый анализ',
        check: () => steps.some(step => step.messageType === 'table' && step.response.includes('финанс')),
        description: 'Таблица с финансовыми расчетами'
      },
      {
        name: 'Интерактивная карта',
        check: () => steps.some(step => step.messageType === 'map' && step.response.includes('карта')),
        description: 'Интерактивная карта с локациями'
      },
      {
        name: 'Расчетный счет',
        check: () => steps.some(step => step.messageType === 'button-group' && step.response.includes('счет')),
        description: 'Вопрос о расчетном счете с кнопками'
      }
    ];

    let passed = 0;
    requirements.forEach(req => {
      const result = req.check();
      console.log(`   ${result ? '✅' : '❌'} ${req.name}: ${result ? 'ПРОЙДЕН' : 'НЕ ПРОЙДЕН'}`);
      if (!result) {
        console.log(`      ${req.description}`);
      }
      if (result) passed++;
    });

    console.log(`\n📊 Итоги анализа: ${passed}/${requirements.length} требований выполнено`);

    return { steps, requirements, passed: passed, total: requirements.length };

  } catch (error) {
    console.error('❌ Ошибка при анализе:', error.message);
    return null;
  }
}

function extractScenarioSteps(fileContent) {
  const steps = [];
  
  // Ищем блок createBusinessScenario
  const scenarioMatch = fileContent.match(/createBusinessScenario\(\):\s*BusinessScenario\s*\{[^}]*return\s*\{[^}]*steps:\s*\[([\s\S]*?)\]\s*\}/);
  
  if (!scenarioMatch) {
    console.log('❌ Не удалось найти блок сценария');
    return steps;
  }

  const stepsContent = scenarioMatch[1];
  
  // Разбираем отдельные шаги
  const stepRegex = /\{\s*\/\/\s*Шаг\s*\d+:\s*([^\n]*)[^}]*trigger:\s*\/([^\/]*)\/[^}]*response:\s*"([^"]*)"[^}]*?(messageType:\s*'([^']*)')?[^}]*?(actions:\s*\[([^\]]*)\])?[^}]*?\}/g;
  
  let match;
  while ((match = stepRegex.exec(stepsContent)) !== null) {
    const step = {
      name: match[1]?.trim() || 'Неизвестный шаг',
      trigger: match[2],
      response: match[3],
      messageType: match[5],
      actions: []
    };

    // Парсим actions если есть
    if (match[6]) {
      const actionsMatch = match[6].match(/\{[\s\S]*?label:\s*'([^']*)'[\s\S]*?\}/g);
      if (actionsMatch) {
        actionsMatch.forEach(actionStr => {
          const labelMatch = actionStr.match(/label:\s*'([^']*)'/);
          if (labelMatch) {
            step.actions.push({ label: labelMatch[1] });
          }
        });
      }
    }

    steps.push(step);
  }

  return steps;
}

// Запускаем анализ
const result = analyzeCoffeeScenario();

if (result) {
  console.log(`\n🎯 Результат анализа: ${result.passed}/${result.total} требований выполнено`);
  
  if (result.passed === result.total) {
    console.log('✅ Сценарий полностью реализован и готов к тестированию!');
  } else {
    console.log('⚠️  Сценарий требует доработки перед тестированием');
  }
}