// Простой анализ реализации сценария открытия кофейни
import fs from 'fs';

function simpleAnalysis() {
  console.log('🔍 Простой анализ реализации сценария открытия кофейни...\n');

  try {
    const fileContent = fs.readFileSync('./src/services/agent/MockAgentService.ts', 'utf8');
    
    console.log('📋 Проверка ключевых элементов сценария:\n');

    const checks = [
      {
        name: 'Триггер по слову "кофе"',
        pattern: /trigger:\s*\/\.\*кофе\.\*\/i/,
        found: false,
        description: 'Регулярное выражение для активации сценария'
      },
      {
        name: 'Кнопки выбора режима (ММБ/КБ)',
        pattern: /ММБ - Модель малого бизнеса.*КБ - Консалтинг бизнеса/,
        found: false,
        description: 'Кнопки для выбора бизнес-режима'
      },
      {
        name: 'Reasoning-сообщение',
        pattern: /messageType:\s*'reasoning'/,
        found: false,
        description: 'Сообщение с цепочкой рассуждений'
      },
      {
        name: 'Форма сбора данных о локации',
        pattern: /messageType:\s*'form'.*локация/i,
        found: false,
        description: 'Форма для сбора информации о локации'
      },
      {
        name: 'Пошаговые вопросы',
        pattern: /город.*тип.*конкуренты/i,
        found: false,
        description: 'Вопросы о городе, типе локации и конкурентах'
      },
      {
        name: 'Финансовая таблица',
        pattern: /messageType:\s*'table'.*финанс/i,
        found: false,
        description: 'Таблица с финансовыми расчетами'
      },
      {
        name: 'Интерактивная карта',
        pattern: /messageType:\s*'map'.*карта/i,
        found: false,
        description: 'Интерактивная карта с локациями'
      },
      {
        name: 'Вопрос о расчетном счете',
        pattern: /messageType:\s*'button-group'.*счет/i,
        found: false,
        description: 'Кнопки для выбора по расчетному счету'
      }
    ];

    let passed = 0;
    checks.forEach(check => {
      check.found = check.pattern.test(fileContent);
      console.log(`   ${check.found ? '✅' : '❌'} ${check.name}`);
      if (!check.found) {
        console.log(`      ${check.description}`);
      }
      if (check.found) passed++;
    });

    console.log(`\n📊 Результат: ${passed}/${checks.length} элементов найдено`);

    if (passed === checks.length) {
      console.log('🎉 Все ключевые элементы сценария реализованы!');
      console.log('\n💡 Рекомендация: Откройте приложение в браузере и протестируйте сценарий вручную.');
    } else {
      console.log('⚠️  Некоторые элементы сценария отсутствуют или требуют доработки.');
    }

    return { checks, passed, total: checks.length };

  } catch (error) {
    console.error('❌ Ошибка при анализе:', error.message);
    return null;
  }
}

// Запускаем анализ
const result = simpleAnalysis();

if (result) {
  console.log(`\n🎯 Итоговый результат: ${result.passed}/${result.total} элементов реализовано`);
  
  if (result.passed === result.total) {
    console.log('✅ Сценарий готов к тестированию!');
  } else {
    console.log('❌ Сценарий требует доработки перед тестированием');
  }
}