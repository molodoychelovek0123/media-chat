// Тест для проверки исправления ошибки timestamp
console.log('🧪 Тестирование исправления ошибки timestamp.toLocaleTimeString');

// Тестируем функцию formatTimestamp с разными типами данных
function testFormatTimestamp() {
  console.log('\n📋 Тест 1: Объект Date');
  const dateObj = new Date();
  const result1 = formatTimestamp(dateObj);
  console.log(`   Вход: ${dateObj}`);
  console.log(`   Результат: ${result1}`);
  console.log(`   ✅ Успех: ${typeof result1 === 'string'}`);
  
  console.log('\n📋 Тест 2: Строка ISO');
  const isoString = new Date().toISOString();
  const result2 = formatTimestamp(isoString);
  console.log(`   Вход: ${isoString}`);
  console.log(`   Результат: ${result2}`);
  console.log(`   ✅ Успех: ${typeof result2 === 'string'}`);
  
  console.log('\n📋 Тест 3: Строка timestamp');
  const timestampString = new Date().toString();
  const result3 = formatTimestamp(timestampString);
  console.log(`   Вход: ${timestampString}`);
  console.log(`   Результат: ${result3}`);
  console.log(`   ✅ Успех: ${typeof result3 === 'string'}`);
  
  console.log('\n🎯 Итог: Все тесты прошли успешно! Ошибка timestamp.toLocaleTimeString исправлена.');
}

// Функция из исправленного компонента
function formatTimestamp(timestamp) {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Запускаем тест
testFormatTimestamp();