import React, {useState, useRef, useEffect} from 'react'
import MessageBubble from './MessageBubble'
import RKOSection from './RKOSection'
import PublicationPreview from './PublicationPreview'
import LeadForm from './LeadForm'
import ServiceSelection from './ServiceSelection'
import InteractiveMap from './InteractiveMap'
import INNVerification from './INNVerification'
import TopSlider from './TopSlider'
import ArticleCards from './ArticleCards'
import './ChatPage.css'


const BUTTON_RKO_MESSAGE = 'Хочу открыть РКО'
const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Привет! Я ваш ИИ-помощник от Сбера. Чем могу помочь вашему бизнесу сегодня?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [currentStep, setCurrentStep] = useState('main')
  const [isAnimating, setIsAnimating] = useState(false)
  const [userInputBubbles, setUserInputBubbles] = useState([]);
  const [isAIChatActive, setIsAIChatActive] = useState(false)
  const [isAITyping, setIsAITyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingIntervalsRef = useRef({})
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }

  useEffect(() => {
    if(messages.length === 1) {
      setTimeout(() => {
        scrollToBottom()
      }, 1300)
    }
    else{
      scrollToBottom();
    }

  }, [messages])

  useEffect(() => {
    // Прокрутка к низу при смене шага (когда появляется высокий компонент)
    if (currentStep !== 'main') {
      setTimeout(() => {
        scrollToBottom()
      }, 350) // Задержка для завершения анимации
    }
  }, [currentStep])

  // Очистка интервалов при размонтировании компонента
  useEffect(() => {
    return () => {
      // Очищаем все активные интервалы набора текста
      Object.values(typingIntervalsRef.current).forEach(interval => {
        clearInterval(interval)
      })
      typingIntervalsRef.current = {}
    }
  }, [])

  const addMessage = (text, sender = 'user', isMarkdown = false, withTypingEffect = false) => {
    scrollToBottom();
    if (withTypingEffect && sender === 'ai') {
      // Создаем сообщение с пустым текстом для начала анимации
      const messageId = Date.now() // Используем timestamp для уникального ID
      const typingMessage = {
        id: messageId,
        text: '',
        sender,
        timestamp: new Date(),
        isMarkdown,
        isTyping: true
      }

      setMessages(prev => [...prev, typingMessage])

      // Запускаем анимацию посимвольного набора
      let currentText = ''
      const textArray = text.split('')
      let index = 0

      const typingInterval = setInterval(() => {
        if (index < textArray.length) {
          currentText += textArray[index]
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId
                ? {...msg, text: currentText}
                : msg
            )
          )
          index++
        } else {
          clearInterval(typingInterval)
          // Убираем флаг typing после завершения
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId
                ? {...msg, isTyping: false}
                : msg
            )
          )
          // Удаляем интервал из рефа
          delete typingIntervalsRef.current[messageId]
        }
      }, 1)

      // Сохраняем ссылку на интервал
      typingIntervalsRef.current[messageId] = typingInterval
    } else {
      const newMessage = {
        id: Date.now(), // Используем timestamp для уникального ID
        text,
        sender,
        timestamp: new Date(),
        isMarkdown,
        isTyping: false
      }
      setMessages(prev => [...prev, newMessage])
    }
  }

  const changeStepWithAnimation = (newStep) => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(newStep)
      setTimeout(() => {
        setIsAnimating(false)
      }, 50)
    }, 300)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputText.trim()) {
      addMessage(inputText, 'user')
      setInputText('')

      // Обработка команды "Открыть РКО"
      if (inputText.toLowerCase().trim() === 'открыть рко'  && !isAIChatActive || inputText.toLowerCase().trim().includes('расчетно') && !isAIChatActive) {
        setTimeout(() => {
          // Показываем сообщение о поиске информации
          addMessage("Ищу актуальную информацию по вашему запросу...", 'ai', false, true)

          // Показываем карточки публикаций через 2 секунды
          setTimeout(() => {
            const publicationsMessage = {
              id: Date.now(),
              text: "Нашел несколько полезных публикаций по теме РКО:",
              sender: 'ai',
              timestamp: new Date(),
              isMarkdown: false,
              isTyping: false,
              isPublications: true,
              publications: [
                "Расчетно-кассовое обслуживание: какому бизнесу нужно и как подключить",
                "Конкурентное преимущество — любовь: как семейная гармония помогает строить бизнес",
                "Следуй за пуховым кроликом: как монетизировать любовь к питомцам",
                "В 21 год заработала на цветах, открыла маникюрный салон и вырастила сеть с оборотом 290 млн руб. в год.",
                "«Шить одежду в Китае проще, но мы делаем иначе»: сколько можно заработать на беговых аксессуарах",
                "Чек-лист: как ИП выбрать банк для расчётного счёта"
              ]
            }
            setMessages(prev => [...prev, publicationsMessage])

            // Через 3 секунды загружаем содержимое answer.md
            setTimeout(() => {

              const text = ` 
# Преимущества расчётно-кассового обслуживания в Сбере: опыт реальных предпринимателей

Открытие расчётного счёта — это не просто формальность, а стратегический шаг для развития бизнеса. Убедительнее всего об этом говорят истории предпринимателей, которые уже прошли этот путь.

## **Карен и Лиза: романтика и строгий учет в кофейне "Кутята"**

**Было:** Молодая пара открыла первую кофейню. Наличные повсюду: в кассе, в ящиках, в карманах. Кто сколько взял — непонятно. Конфликты из-за денег могли разрушить и бизнес, и отношения.

**Решение в Сбере:**
- Подключили **эквайринг** — 95% гостей платят картами
- **Зарплатный проект** — сотрудники получают деньги вовремя
- **Мобильный банк** — Лиза из дома видит, какая кофейня сколько заработала

**Результат:** За 3 года — 3 кофейни в Москве и интернет-магазин. "РКО стало нашим третьим партнером в бизнесе", — говорят супруги.

## **Артем: почему даже маленькому бренду Enklepp нужен серьезный банкинг**

Артем Беркаль шьет беговые аксессуары — узкая ниша, но растет быстро.

**Проблема:** Мелкие переводы от сотен покупателей, работа с маркетплейсами.

**Решение от Сбера:**
- **Интеграция с маркетплейсами** — деньги приходят автоматически
- **СБП и QR-платежи** — покупатели платят мгновенно
- **Тариф "под рост"** — платишь только за то, чем пользуешься

"Когда я понял, что могу принимать платежи даже через соцсети — это изменило все", — говорит Артем.

---

## **Что общего у этих историй?**

Все эти предприниматели начинали с малого. И всем им РКО в Сбере помогло:
 
- **Выглядеть солидно** — даже с одним сотрудником  
- **Экономить время** — вместо ручного учета заниматься бизнесом  
- **Расти быстрее** — за счет кредитов и прозрачной истории  
- **Спать спокойно** — все операции легальны, вопросы от налоговой не страшны

Опыт предпринимателей показывает, что профессиональное расчётно-кассовое обслуживание — это не расход, а инвестиция в стабильность и масштабирование бизнеса.
## **Как повторить их успех?**

[Открыть счет в Сбере можно бесплатно](#открыть-рко). До 31 марта 2025 года ты еще и получишь **электронную подпись в подарок** — она нужна для участия в тендерах и работы с госорганами.

Говорят же: "Не откладывай на завтра то, что может принести деньги сегодня". Эти предприниматели не отложили — и не жалеют.
`;


              setUserInputBubbles([
                {
                  text: "Открыть РКО", action: () => {
                    handleQuickAction('rko');
                    setUserInputBubbles([]);
                  }
                },
                {
                  text: "Больше публикаций по теме", action: () => {
                    handleQuickAction('publication')
                    setUserInputBubbles([]);
                  }
                },
                {
                  text: "Заявка на консультацию", action: () => {
                    handleQuickAction('lead')
                    setUserInputBubbles([]);
                  }
                }
              ])
              // Добавляем markdown контент как сообщение в массив с эффектом набора
              addMessage(text, 'ai', true, true)

              // Загружаем содержимое answer.md
              // fetch('/answer.md')
              //   .then(response => response.text())
              //   .then(text => {
              //     setUserInputBubbles([
              //       {
              //         text: "Открыть РКО", action: () => {
              //           handleQuickAction('rko');
              //           setUserInputBubbles([]);
              //         }
              //       },
              //       {
              //         text: "Больше публикаций по теме", action: () => {
              //           handleQuickAction('publication')
              //           setUserInputBubbles([]);
              //         }
              //       },
              //       {
              //         text: "Заявка на консультацию", action: () => {
              //           handleQuickAction('lead')
              //           setUserInputBubbles([]);
              //         }
              //       }
              //     ])
              //     // Добавляем markdown контент как сообщение в массив с эффектом набора
              //     addMessage(text, 'ai', true, true)
              //   })
              //   .catch(error => {
              //     console.error('Ошибка загрузки answer.md:', error)
              //     addMessage("Извините, произошла ошибка при загрузке информации о РКО.", 'ai', false, true)
              //   })
            }, 3000)
          }, 2000)
        }, 500)
      } else if (isAIChatActive) {
        // Логика AI-чата с последовательным сценарием
        setIsAITyping(true)
        setTimeout(() => {
          const userMessagesCount = messages.filter(m => m.sender === 'user').length

          console.log(`Пользователь написал ${userMessagesCount} сообщений`)
          // Определяем текущий шаг сценария на основе количества сообщений пользователя
          switch (userMessagesCount) {
            case 5:
              // Первый ответ AI после первого сообщения пользователя
              addMessage(`Я проанализировал ваш вводный запрос. Позвольте выразить поддержку — создание места с душой это уже огромный шаг. Ваша проблема с проходимостью вне часов пик — классическая и, что главное, решаемая. Давайте вместе разработаем план. Для начала я задам несколько уточняющих вопросов, это поможет мне предложить максимально точные решения.

Первый вопрос по вашей аудитории. Вы упомянули людей из бизнес-центра. Кто они? Это в основном офисные сотрудники, которые приходят за кофе «с собой», или есть те, кто приходит с ноутбуком поработать? Есть ли поблизости жилые дома, приходят ли к вам люди «с улицы»?`, 'ai', false, true)
              break

            case 6:
              // Второй ответ AI после второго сообщения пользователя
              addMessage("Что уникального вы предлагаете, кроме кофе? Может быть, особый сорт, авторская выпечка, атмосфера, мероприятия?", 'ai', false, true)
              break

            case 7:
              // Третий ответ AI после третьего сообщения пользователя
              addMessage("Понял. Самый важный актив! Это фундамент для нашего плана. Для более точного анализа подскажите, где находится ваша точка продаж. Можете указать локацию вашего бизнеса на карте.", 'ai', false, true)
              // Показываем кнопку для выбора локации
              setTimeout(() => {
                setUserInputBubbles([
                  {
                    text: "Выбрать локацию на карте",
                    action: () => {
                      handleMapButton()
                      setUserInputBubbles([])
                    }
                  }
                ])
              }, 2000)
              break

            default:
              // После выбора локации показываем финальный план
              if (currentStep === 'inn') {
                addMessage(`На основе ваших ответов я провел симуляцию и выделил 3 стратегических вектора для роста посещаемости вне пиковых часов.

**1. Трансформация пространства**
*   **Задача:** Заполнить дневные часы.
*   **Решения:**
    *   **Work&Coffee Zone:** Зона с Wi-Fi и розетками. Тариф «Рабочий день» с неограниченным кофе и выпечкой.
    *   **Кофе-брейки для команд:** Сотрудничество с бизнес-центрами, скидка 15% на заказы от 5 человек.

**2. Гиперлокализация**
*   **Задача:** Привлечь жителей ближайших домов.
*   **Решения:**
    *   **Вечерний десерт:** Кофе в подарок к десерту после 18:00.
    *   **Мастер-классы:** Платные занятия по завариванию кофе по субботам.

**3. Цифровое продвижение**
*   **Задача:** Точечное привлечение клиентов.
*   **Решения:**
    *   **Утро (7:00-10:00):** Реклама у бизнес-центров со скидкой на кофе «с собой».
    *   **Обед (12:00-15:00):** Реклама на сотрудников офисов с предложением бизнес-ланча.
    *   **Вечер/выходные:** Реклама для жилых районов про мастер-классы и вечерние акции.`, 'ai', true, true)
              } else {
                // Резервный ответ для других случаев
                addMessage("Спасибо за информацию! Продолжайте рассказывать о вашем бизнесе, чтобы я мог предложить наилучшие решения.", 'ai', false, true)
              }
          }

          setIsAITyping(false)
        }, 1500)
      }
      else if( inputText.toLowerCase().trim().includes('продукты') && inputText.toLowerCase().trim().includes('полезны при открытии рко')) {

        setIsAITyping(true)

        setTimeout(() => {
          addMessage(`
✅ Критически важные продукты (без них работать практически невозможно)

**1 Интернет-банк и мобильное приложение для бизнеса**

◦ Что это: Ваш основной инструмент управления финансами компании.

◦ Зачем нужно: Позволяет в любой момент видеть остатки, проверять выписки, оплачивать счета, отправлять платежки и обмениваться документами с бухгалтером без визита в банк.

**2 Система клиент-банк (для юридических лиц)**

◦ Что это: Часто это синоним интернет-банка, но иногда подразумевает более продвинутую версию для массовой отправки платежных поручений.

◦ Зачем нужно: Обязательный инструмент для бухгалтера. Позволяет подписывать платежи электронной подписью (ЭЦП) и отправлять их в банк.

✅ Очень рекомендуемые продукты (сильно упрощают жизнь и экономят деньги)

**3 Зарплатный проект**

◦ Что это: Сервис для автоматического расчета и перечисления зарплаты сотрудникам на их карты.

◦ Зачем нужно:

▪ Экономия: Часто банки значительно снижают стоимость обслуживания РКО при подключении зарплатного проекта.

▪ Удобство: Избавляет бухгалтерию от рутинной работы.

▪ Лояльность сотрудников: Сотрудники получают зарплату на карты вашего банка, что может дать им дополнительные льготы (кешбэк, бесплатное снятие наличных и т.д.).

**4 Эквайринг**

◦ Что это: Прием безналичных платежей от клиентов через терминал или онлайн-кассу.

◦ Зачем нужно:

▪ Для розницы и услуг: Обязателен, если у вас есть офлайн-точка

Этот набор продуктов формирует готовое и эффективное финансовое ядро для вашей компании. Не откладывайте на потом возможность настроить бесперебойные денежные потоки и сосредоточиться на развитии бизнеса.

*Готовы начать?*
[Откройте РКО онлайн](#открыть-рко) всего за несколько минут и получите полный доступ ко всем необходимым сервисам для вашего бизнеса.

          `, 'ai', true, true)

          setIsAITyping(false)
        }, 1500)

      }
      else {
        // Имитация ответа AI для других сообщений
        setTimeout(() => {
          addMessage("Спасибо за ваш вопрос! Я могу помочь вам с различными бизнес-задачами. Выберите одну из опций ниже.", 'ai', false, true)
        }, 1000)


      }
    }
  }

  const handleQuickAction = (action) => {
    setUserInputBubbles([])
    switch (action) {
      case 'rko':
        addMessage(BUTTON_RKO_MESSAGE, 'user')
        setTimeout(() => {
          addMessage(`**РКО в Сбере** — это современный финансовый инструмент, который помогает сосредоточиться на развитии бизнеса, а не на решении операционных вопросов.
           **Чтобы начать работу, достаточно:**
1. Заполнить заявку на открытие счета
2. Подготовить базовые документы
3. Получить реквизиты и начать работу
`, 'ai', true, true)
        }, 1);
        setTimeout(() => {
          changeStepWithAnimation('rko')
        }, 2500);
        break
      case 'publication':
        changeStepWithAnimation('publication')
        addMessage("Покажи публикации", 'user')
        break
      case 'lead':
        changeStepWithAnimation('lead')
        addMessage("Хочу оставить заявку", 'user')
        break
      default:
        break
    }
  }

  const handleServiceSelect = (service) => {
    setIsAIChatActive(true);
    setUserInputBubbles([]);
    changeStepWithAnimation('default');
    addMessage(`Выбрана услуга: ${service}`, 'user')
    setTimeout(() => {
      addMessage("Отлично! Я помогу вам с выбранной услугой. Расскажите подробнее о вашем бизнесе, чтобы я мог предложить наилучшее решение.", 'ai', false, true)
    }, 1000)
  }

  const handleFormComplete = () => {
    changeStepWithAnimation('waiting')
    addMessage("Форма заполнена, жду звонка", 'user')
    setTimeout(() => {
      addMessage("Отлично! Пока ждете звонка от нашего консультанта, могу предложить дополнительные услуги для вашего бизнеса.", 'ai', false, true)
    }, 1000)
  }

  const handleMapSelect = (location) => {
    changeStepWithAnimation('inn')
    addMessage(`Выбрана локация`, 'user')
    // После выбора локации автоматически показываем финальный план

  }

  const handleINNComplete = () => {
    changeStepWithAnimation('main')
    addMessage("ИНН подтвержден", 'user')
    setTimeout(() => {
      addMessage(`На основе ваших ответов я провел симуляцию и выделил 3 стратегических вектора для роста посещаемости вне пиковых часов.

**1. Трансформация пространства**
*   **Задача:** Заполнить дневные часы.
*   **Решения:**
    *   **Work&Coffee Zone:** Зона с Wi-Fi и розетками. Тариф «Рабочий день» с неограниченным кофе и выпечкой.
    *   **Кофе-брейки для команд:** Сотрудничество с бизнес-центрами, скидка 15% на заказы от 5 человек.

**2. Гиперлокализация**
*   **Задача:** Привлечь жителей ближайших домов.
*   **Решения:**
    *   **Вечерний десерт:** Кофе в подарок к десерту после 18:00.
    *   **Мастер-классы:** Платные занятия по завариванию кофе по субботам.

**3. Цифровое продвижение**
*   **Задача:** Точечное привлечение клиентов.
*   **Решения:**
    *   **Утро (7:00-10:00):** Реклама у бизнес-центров со скидкой на кофе «с собой».
    *   **Обед (12:00-15:00):** Реклама на сотрудников офисов с предложением бизнес-ланча.
    *   **Вечер/выходные:** Реклама для жилых районов про мастер-классы и вечерние акции.
    
    Если хотите, я могу построить маркетинговый план и отправить его вам в pdf формате
    `, 'ai', true, true)

      setTimeout(()=>{
        setUserInputBubbles([
          {
            text: "Отправить в pdf", action: () => {
              addMessage('Маркетинговый план в pdf', 'user', false, false);
              setUserInputBubbles([])
              
              // Показываем сообщение с PDF файлом
              setTimeout(() => {
                addMessage("Вот ваш маркетинговый план в формате PDF. Вы можете скачать его для дальнейшего использования.", 'ai', false, true)
                
                // Добавляем сообщение с ссылкой на PDF и онлайн отчетом
                setTimeout(() => {
                  const pdfMessage = {
                    id: Date.now(),
                    text: "Маркетинговый план.pdf",
                    sender: 'ai',
                    timestamp: new Date(),
                    isMarkdown: false,
                    isTyping: false,
                    isFile: true,
                    fileType: 'pdf',
                    fileName: 'Маркетинговый план.pdf',
                    fileUrl: '/marketing-plan.pdf',
                    hasOnlineReport: true
                  }
                  setMessages(prev => [...prev, pdfMessage])
                }, 1000)
              }, 1000)
            },
          },
          {
            text: "Вернуться на главную страницу",
            action: () => {
              setTimeout(() => {
                changeStepWithAnimation('main')
                setCurrentStep('show-content')
              }, 400)
            },
          }
        ])
      }, 4000)
    }, 1000)
  }

  const handleMapButton = () => {
    addMessage("Хочу выбрать локацию на карте", 'user')
    setTimeout(() => {
      addMessage("Отлично! Выберите регион на карте для анализа бизнес-возможностей.", 'ai', false, true)
      changeStepWithAnimation('map')
    }, 1000)
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      // case 'rko':
      //   return <RKOSection
      //     onComplete={() => changeStepWithAnimation('main')}
      //     onOpenAccount={() => handleQuickAction('lead')}
      //   />
      case 'publication':
        return <PublicationPreview onComplete={() => changeStepWithAnimation('main')}/>

      case 'rko':
      case 'lead':
        return <LeadForm onComplete={handleFormComplete}/>
      case 'waiting':
        return <ServiceSelection onServiceSelect={handleServiceSelect}/>
      case 'map':
        return <InteractiveMap onLocationSelect={handleMapSelect}/>
      case 'inn':
        return <INNVerification onComplete={handleINNComplete}/>
      case 'show-content':
        return (
          <div className="content-showcase">
            <h3>Пока вы ждете звонок, ознакомьтесь с нашими материалами:</h3>
            {/* Слайдер */}
            <TopSlider/>
            {/* Подборка публикаций */}
            <ArticleCards/>
          </div>
        )
      default:
        return null;
      // return (
      //   <div className="quick-actions">
      //     <h3>Быстрые действия:</h3>
      //     <div className="action-buttons">
      //       <button
      //         className="btn btn-primary"
      //         onClick={() => handleQuickAction('rko')}
      //       >
      //         Открыть РКО
      //       </button>
      //       <button
      //         className="btn btn-primary"
      //         onClick={() => handleQuickAction('publication')}
      //       >
      //         Публикации
      //       </button>
      //       <button
      //         className="btn btn-primary"
      //         onClick={() => handleQuickAction('lead')}
      //       >
      //         Оставить заявку
      //       </button>
      //     </div>
      //   </div>
      // )
    }
  }


  const openReportSidebar = () => {
    setIsSidebarOpen(true)
  }

  const closeReportSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="chat-page">
      {/* Сайдбар для онлайн отчета */}
      {isSidebarOpen && (
        <div className="report-sidebar-overlay" onClick={closeReportSidebar}>
          <div className="report-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="report-sidebar-header">
              <h3>Онлайн отчет</h3>
              <button className="close-sidebar-btn" onClick={closeReportSidebar}>×</button>
            </div>
            <div className="report-sidebar-content">
              <iframe
                src="/result.html"
                className="report-iframe"
                title="Онлайн отчет"
              />
            </div>
          </div>
        </div>
      )}
      <div className="chat-container">
        <div className='chat-scroll'>
          <div className="messages-container">
            {/* Верхний слайдер */}
            <TopSlider/>

            {/* Подборка карточек статей */}
            <ArticleCards/>

            {messages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                onLinkClick={() => handleQuickAction('rko')}
                onOpenReport={openReportSidebar}
              />
            ))}


            {/* Индикатор печатания AI */}
            {isAITyping && (
              <div className="message-bubble ai-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>AI печатает...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Кнопка выбора локации для AI-чата */}
            {/*{isAIChatActive && messages.filter(m => m.sender === 'user').length >= 3 && (*/}
            {/*  <div className="message-bubble ai-message">*/}
            {/*    <div className="message-content">*/}
            {/*      <div className="ai-chat-actions">*/}
            {/*        <button*/}
            {/*          className="btn btn-primary"*/}
            {/*          onClick={handleMapButton}*/}
            {/*        >*/}
            {/*          Выбрать локацию на карте*/}
            {/*        </button>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}

            <div ref={messagesEndRef}/>
            {messages.length > 2 && (
              <div className={`interactive-section ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                {renderCurrentStep()}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="message-input-form">
          <div className="quick-btns">
            {userInputBubbles.map(item => (
              <button type="button" onClick={item.action} className="btn quick-btn"> {item.text} </button>
            ))}
          </div>
          <div className="form-input-group">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                if (!e.shiftKey) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSendMessage(e);
                }
              }

            }}
            placeholder="Введите ваше сообщение..."
            rows={6}
            className="message-input"
          />
            <button type="submit" className={
              `send-button ${inputText.length > 0 ? 'show' : 'hide'}`
            }>
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatPage