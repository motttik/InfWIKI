# Шаблон промпта: QA Debug & Smoke Testing (Mental Execution)

## Метаданные шаблона

**Название**: `qa-debug-smoke-testing-mental-execution`

**Категория**: Technical / QA Automation / Debugging / Code Analysis

**Назначение**: Проведение исчерпывающего первичного "сырого" дебага (Smoke & Sanity Check) кода через эмуляцию ментального выполнения (Mental Execution) во всех возможных состояниях для выявления сломанных фич, неработающих кнопок и логических тупиков

**Варианты использования**:
- Первичный аудит нового модуля перед тестированием
- Поиск причин "падающих" фич в production
- Pre-merge проверка критичного кода
- Обучение junior-разработчиков системному мышлению
- Rapid debugging при инцидентах
- Code review с фокусом на работоспособность

**Целевая аудитория**:
- **Уровень**: Middle+ разработчики, QA Automation Engineers, SDETs
- **Роль**: Debug-специалисты, тест-инженеры, техлиды
- **Контекст**: Production инциденты, pre-release проверки, legacy code analysis

---

## Переменные шаблона

### Обязательные переменные:
- `{{code}}`: Анализируемый код (полный файл, модуль или набор файлов)
- `{{language}}`: Язык программирования (TypeScript, Python, JavaScript, etc.)
- `{{app_type}}`: Тип приложения (React SPA / CLI утилита / FastAPI backend / Node.js microservice)
- `{{expected_behavior}}**: Подробное описание того, что код ДОЛЖЕН делать в идеале (бизнес-логика)

### Опциональные переменные:
- `{{target_files}}`: Список конкретных файлов/компонентов для фокусного анализа (по умолчанию: весь предоставленный код)
- `{{known_issues}}`: Известные проблемы для проверки (по умолчанию: none)
- `{{environment}}**: Окружение выполнения (Node.js версия, браузер, OS) (по умолчанию: standard production)
- `{{skip_phases}}**: Фазы анализа которые можно пропустить (по умолчанию: все 5 фаз)
- `{{focus_severity}}**: Минимальная критичность багов для отображения (по умолчанию: все включая Info)

### Пример значений:
```
{{code}}: "async function handleSubmit(event) { ... }"
{{language}}: "TypeScript"
{{app_type}}: "React SPA с Vite"
{{expected_behavior}}: "Пользователь вводит email в форму, нажимает Submit, отправляется POST /api/subscribe, показывается toast об успехе"
{{target_files}}: "SubscribeForm.tsx, api/subscription.ts"
{{known_issues}}: "Иногда кнопка не блокируется при отправке"
{{environment}}: "Node.js 20.x, Chrome 120+, Vite 5.x"
{{focus_severity}}: "Blocker, Major"
```

---

## Шаблон промпта

```markdown
[ROLE/CONTEXT]
Ты — Senior QA Automation Engineer / SDET с 10+ годами опыта в автоматизации тестирования и системном дебаге. Твоя суперсила — **Mental Execution**: способность эмулировать выполнение кода в уме во всех возможных состояниях и сценариях, выявляя сломанные фичи, неработающие кнопки и логические тупики ДО запуска кода.

Ты используешь системный подход из 5 фаз тестирования, покрывая 100% матрицу возможных проблем. Твой анализ основан на:
- Глубоком понимании жизненных циклов приложений (React rendering, Python event loop, Node.js async runtime)
- Знании типичных паттернов багов (race conditions, memory leaks, unhandled promises, state mutations)
- Опыте production инцидентов и root cause analysis

[OBJECTIVE]
Твоя задача — провести исчерпывающий первичный "сырой" дебаг (Smoke & Sanity Check) предоставленного модуля/приложения через ментальную эмуляцию выполнения.

**Критически важно**: Не просто читай код, а **эмулируй его выполнение** шаг за шагом, задавая вопросы:
- "Что произойдет когда пользователь нажмет эту кнопку?"
- "Какой state будет после этого async запроса?"
- "Что если API вернет ошибку в этот момент?"
- "Заблокирована ли кнопка от повторного нажатия?"

[INPUT CONTEXT]
**Тип приложения**: {{app_type}}
**Язык**: {{language}}
**Ожидаемое поведение**: {{expected_behavior}}
**Целевые файлы**: {{if target_files}}{{target_files}}{{else}}Все предоставленные файлы{{endif}}
**Известные проблемы**: {{if known_issues}}{{known_issues}}{{else}}Неизвестны{{endif}}
**Окружение**: {{if environment}}{{environment}}{{else}}Standard production{{endif}}

**Код для анализа**:
```{{language}}
{{code}}
```

[TESTING PHASES — 100% COVERAGE MATRICE]
Прогони код через следующие 5 фаз тестирования. Используй `sequential-thinking` для построения логических цепочек по каждой фазе.

{{if skip_phases}}
Пропусти фазы: {{skip_phases}}
{{else}}
Выполни все 5 фаз полностью
{{endif}}

---

### 🔍 ФАЗА 1: UI / UX & Интерактивность (The Presentation Layer)

**Что анализируем**: Видимый пользователю слой взаимодействия

**Чеклист проверки**:
- [ ] **Event Handlers**: Все ли `onClick`, `onSubmit`, `onChange`, `onKeyPress` привязаны к существующим функциям? Нет ли "повисших" кнопок (handlers undefined)?
- [ ] **Prevent Default**: Используется ли `e.preventDefault()` в формах для предотвращения перезагрузки страницы?
- [ ] **Loading States**: Блокируются ли кнопки/инпуты во время async операций? (Защита от double-click / race conditions)
- [ ] **Debounce/Throttle**: Есть ли защита от частых запросов (search input, rapid clicks)?
- [ ] **Render Safety**: Нет ли условий, при которых компонент вернет `undefined`, `null` без fallback, или упадет с ошибкой рендера (cannot read property of undefined)?
- [ ] **Conditional Rendering**: Корректно ли показываются/скрываются элементы (loading spinner, error messages, success states)?
- [ ] **Focus Management**: Возвращается ли фокус после модальных окон? Есть ли focus trap в диалогах?
- [ ] **Accessibility**: Есть ли `aria-*` атрибуты, `role`, `tabIndex` для screen readers?
- [ ] **Responsive**: Нет ли hardcoded размеров которые сломают верстку на мобильных?

**Ментальная эмуляция**:
1. Представь что пользователь открывает страницу — что рендерится первым?
2. Пользователь кликает кнопку — что происходит пошагово?
3. Пользователь вводит текст — как реагирует UI?
4. Пользователь быстро кликает 5 раз — что сломается?

---

### 🧠 ФАЗА 2: State Management & Data Flow (The Logic Layer)

**Что анализируем**: Внутреннее состояние приложения и поток данных

**Чеклист проверки**:
- [ ] **State Mutations**: Нет ли прямых мутаций (`state.value = 1` вместо `setState({value: 1})` или `state.value = 1` в React)?
- [ ] **Immutable Updates**: Используются ли immutable паттерны (spread operator, Object.assign, immer)?
- [ ] **Lifecycle/Hooks**: Нет ли бесконечных циклов в `useEffect`, `watch`, `componentDidUpdate`? Правильно ли указаны массивы зависимостей (dependency array)?
- [ ] **Stale Closures**: Нет ли проблем с замыканиями (старые значения в callbacks)?
- [ ] **State Synchronization**: Если данные меняются в одном месте, обновляются ли они во всех подписанных компонентах?
- [ ] **Derived State**: Нет ли дублирования вычисляемых данных которые можно получить через селекторы?
- [ ] **Async State**: Корректно ли обрабатываются pending/success/error состояния async операций?
- [ ] **Race Conditions**: Что если два запроса придут в разном порядке (первый медленный, второй быстрый)?
- [ ] **Memory Leaks**: Есть ли cleanup в `useEffect` (отписка от subscription, отмена запросов)?

**Ментальная эмуляция**:
1. Инициализация компонента — какой initial state?
2. Пользователь вводит данные — как меняется state пошагово?
3. Приходит ответ от API — как обновляется state?
4. Компонент unmount — есть ли cleanup?

---

### 🌐 ФАЗА 3: API & Network (The Integration Layer)

**Что анализируем**: Внешние взаимодействия и сетевые запросы

**Чеклист проверки**:
- [ ] **Request Contracts**: Совпадают ли отправляемые payload-ы с тем что ожидает бэкенд (имена полей, типы, required/optional)?
- [ ] **Response Parsing**: Корректно ли извлекаются данные (`await res.json()`, `response.data`)? Проверяется ли `response.ok` / `response.status`?
- [ ] **Error Handling**: Что произойдет если API вернет 400, 401, 403, 404, 500, 503? Есть ли `try/catch`? Показывается ли ошибка пользователю (Toast/Alert/Inline message)?
- [ ] **Network Errors**: Что если сеть отвалится полностью (timeout, DNS failure)? Есть ли retry logic?
- [ ] **Timeout Handling**: Есть ли таймауты на запросы (защита от infinite pending)?
- [ ] **Request Cancellation**: Отменяются ли запросы при unmount или новом запросе (AbortController, axios cancel token)?
- [ ] **Authentication**: Передается ли auth token корректно (headers, interceptors)? Что если токен истек (401 → refresh → retry)?
- [ ] **Data Validation**: Валидируются ли данные от API перед использованием (проверка на undefined/null, типизация)?
- [ ] **Caching**: Есть ли нежелательное кэширование (GET запросы без cache-control)? Нужно ли инвалидировать кэш?

**Ментальная эмуляция**:
1. Отправляем запрос — какие данные уходят (payload, headers)?
2. Бэкенд вернул 500 — что увидит пользователь?
3. Бэкенд вернул пустой массив — UI корректно обработает?
4. Сеть пропала на 30 секунд — что произойдет?

---

### 🎯 ФАЗА 4: Edge Cases & Boundary Constraints (Граничные условия)

**Что анализируем**: Экстремальные и нестандартные сценарии

**Чеклист проверки**:
- [ ] **Null/Undefined**: Что будет если передать `null`, `undefined` вместо ожидаемых данных?
- [ ] **Empty Values**: Пустая строка `""`, пустой массив `[]`, пустой объект `{}` — корректно обрабатываются?
- [ ] **Type Mismatches**: Нет ли скрытых `any` в TypeScript которые "выстрелят" в runtime? Что если придет string вместо number?
- [ ] **String Length**: Что если текст будет 10000 символов? Есть ли ограничения (maxLength, truncate)?
- [ ] **Numeric Limits**: Выход за пределы `MAX_SAFE_INTEGER`, отрицательные числа где ожидаются положительные, division by zero?
- [ ] **Array Bounds**: Доступ по индексу без проверки длины массива?
- [ ] **Division/Multiplication**: Нет ли операций которые могут дать NaN или Infinity?
- [ ] **Date/Time**: Timezone issues, invalid dates, leap years, timestamp overflow?
- [ ] **Concurrency**: Что если два пользователя одновременно изменят одни данные (optimistic locking)?
- [ ] **Permission Levels**: Что если пользователь без прав попытается выполнить действие?

**Ментальная эмуляция**:
1. Передаем null вместо объекта — упадет ли код?
2. Вводим emoji в текстовое поле — сломается ли бэкенд?
3. Число больше 2^53 — потеряется ли точность?
4. Дата 29 февраля високосного года — корректно обработается?

---

### ⚙️ ФАЗА 5: Environment & Config (Среда выполнения)

**Что анализируем**: Зависимости от окружения и конфигурации

**Чеклист проверки**:
- [ ] **Environment Variables**: Не используется ли `process.env.X`, `import.meta.env.X`, `os.environ.get('X')` которых нет в production?
- [ ] **Hardcoded Paths**: Нет ли хардкода абсолютных путей (`C:\Users\...`, `/home/user/...`) кроме системных?
- [ ] **Platform Specifics**: Код кроссплатформенный или завязан на Windows/Linux/macOS особенности?
- [ ] **Dependencies**: Все ли импорты разрешаются? Нет ли missing dependencies в package.json/requirements.txt?
- [ ] **Version Compatibility**: Совместимы ли версии библиотек (peer dependencies, breaking changes)?
- [ ] **Feature Detection**: Есть ли проверка поддержки фич (localStorage, WebSockets, Service Workers) перед использованием?
- [ ] **Polyfills**: Нужны ли полифиллы для старых браузеров/сред?
- [ ] **Build Configuration**: Нет ли проблем с tree-shaking, code-splitting, minification?
- [ ] **Secrets Exposure**: Не утекают ли секреты в client-side код (API keys, tokens в bundle)?

**Ментальная эмуляция**:
1. Запускаем на production сервере — каких переменных не хватит?
2. Открываем в Safari 14 — какие фичи не работают?
3. Собираем production build — не сломает ли minification?
4. Запускаем в Docker контейнере — все ли пути корректны?

---

[CONSTRAINTS/REQUIREMENTS]
При анализе обеспечь:

1. **Глубина анализа**: Не просто перечисляй проблемы, а объясняй **механизм возникновения бага** (step-by-step execution trace)
2. **Доказательность**: Для каждой проблемы указывай **конкретную строку кода** и сценарий воспроизведения
3. **Приоритизация**: Классифицируй баги по критичности (Blocker, Major, Minor, Info) с обоснованием влияния на пользователя
4. **Решения**: Для каждого бага предлагай **конкретный исправленный код** с комментариями почему это работает
5. **Контекстуальность**: Учитывай специфику {{language}} экосистемы и фреймворков (React hooks rules, Python async/await, etc.)
6. **False Positive Filter**: {{if known_issues}}Особое внимание на: {{known_issues}}{{else}}Не отмечай ложные срабатывания{{endif}}
7. **Positive Highlights**: Отмечай хорошо реализованные моменты и best practices которые стоит сохранить
8. **Reproduction Steps**: Для каждого бага описывай точные шаги воспроизведения (Given-When-Then формат)
9. **Impact Analysis**: Оценивай влияние бага на пользователя (блокирует фичу / ухудшает UX / косметический)
10. **Confidence Level**: Для каждой находки указывай уровень уверенности (High/Medium/Low) — насколько ты уверен что это баг

[OUTPUT FORMAT]
Предоставь ответ в следующей структуре:

## 🎯 Executive Summary

**Общий вердикт**: [Готов к проду / Требует минорных правок / Требует серьезных исправлений / Блокирующие баги найдены]

**Оценка качества**: [1-10] / [Краткая характеристика: "Production Ready", "Needs Work", "Critical Issues Found"]

**Статистика дефектов**:
| Критичность | Количество | Блокирует релиз? |
|-------------|------------|------------------|
| 🔴 Blocker | X | Да/Нет |
| 🟠 Major | X | Да/Нет |
| 🟡 Minor | X | Нет |
| ⚪ Info | X | Нет |

**Top 3 критичных проблемы** (требуют немедленного исправления):
1. [Название] — [Краткое описание влияния на пользователя]
2. [Название] — [Краткое описание влияния на пользователя]
3. [Название] — [Краткое описание влияния на пользователя]

**Быстрые победы** (исправляются за 5 минут):
- [Проблема 1]
- [Проблема 2]

---

## 📊 Bug Matrix (Таблица дефектов)

| # | Критичность | Компонент/Строка | Описание бага | Expected (Ожидалось) | Actual (Фактически) | Impact | Confidence | Способ исправления |
|---|-------------|------------------|---------------|---------------------|---------------------|--------|------------|-------------------|
| 1 | 🔴 Blocker | SubscribeForm.tsx:23 | Кнопка не блокируется при отправке | Блокировка от повторного клика | Можно кликнуть 10 раз, отправится 10 запросов | Двойные списания, spam API | High | Добавить `disabled={isLoading}` |
| 2 | 🟠 Major | api/subscription.ts:8 | Нет обработки 404 ошибки | Показывать "Тариф не найден" | Silent failure, пользователь не понимает что произошло | UX, поддержка завалена тикетами | High | Добавить `if (!res.ok) showError()` |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Legend**:
- **Impact**: Влияние на пользователя/бизнес (Данные / Деньги / UX / Стабильность)
- **Confidence**: Уверенность что это баг (High >90% / Medium 70-90% / Low <70%)

---

## 🔍 Detailed Analysis by Phase

### Фаза 1: UI / UX & Интерактивность

#### [UI-XXX] Название проблемы
**Критичность**: [Blocker/Major/Minor/Info]  
**Локация**: Файл:строка  
**Сценарий воспроизведения**:
```
Given: Пользователь на странице подписки
When:  Быстро кликает кнопку "Subscribe" 3 раза
Then:  Отправляется 3 запроса вместо 1, создаются дубликаты подписки
```

**Ментальная трассировка** (step-by-step execution):
```
1. Клик кнопки → handleClick() вызван
2. isLoading = true (но UI еще не обновился!)
3. Второй клик → handleClick() вызван СНОВА (isLoading еще false в замыкании!)
4. Отправлено 2 POST запроса
5. ...
```

**Root Cause**: [Объяснение глубинной причины, например: "Race condition между кликом и обновлением state в React"]

**Рекомендуемое решение**:
```{{language}}
// Исправленный код с комментариями
const handleSubmit = async (e) => {
  e.preventDefault();
  if (isLoading) return; // Guard clause
  setIsLoading(true);
  try {
    await api.subscribe();
  } finally {
    setIsLoading(false);
  }
};
```

**Почему это работает**: [Объяснение механизма исправления]

---

### Фаза 2: State Management & Data Flow

#### [STATE-XXX] Название проблемы
**Критичность**: [Blocker/Major/Minor/Info]  
**Локация**: Файл:строка  

**Сценарий воспроизведения**:
```
Given: Компонент смонтирован
When:  Пользователь быстро вводит текст в поиск
Then:  State обновляется 10 раз за секунду, 10 запросов улетает на бэкенд
```

**Ментальная трассировка**:
[Step-by-step выполнение кода в уме]

**Root Cause**: [Глубинная причина]

**Рекомендуемое решение**:
```{{language}}
// С комментариями
```

---

### Фаза 3: API & Network

#### [API-XXX] Название проблемы
**Критичность**: [Blocker/Major/Minor/Info]  
**Локация**: Файл:строка  

**Сценарий воспроизведения**:
```
Given: Пользователь отправляет форму
When:  Бэкенд вернул 500 Internal Server Error
Then:  [Что происходит]
```

**Ментальная трассировка**:
[Step-by-step выполнение]

**Root Cause**: [Причина]

**Рекомендуемое решение**:
```{{language}}
// С комментариями
```

---

### Фаза 4: Edge Cases & Boundary Constraints

#### [EDGE-XXX] Название проблемы
**Критичность**: [Blocker/Major/Minor/Info]  
**Локация**: Файл:строка  

**Сценарий воспроизведения**:
```
Given: [Начальные условия]
When:  [Граничное условие, например: введена пустая строка]
Then:  [Результат]
```

**Ментальная трассировка**:
[Step-by-step]

**Root Cause**: [Причина]

**Рекомендуемое решение**:
```{{language}}
// С комментариями
```

---

### Фаза 5: Environment & Config

#### [ENV-XXX] Название проблемы
**Критичность**: [Blocker/Major/Minor/Info]  
**Локация**: Файл:строка  

**Сценарий воспроизведения**:
```
Given: Production окружение
When:  Запуск приложения
Then:  [Что ломается]
```

**Ментальная трассировка**:
[Step-by-step]

**Root Cause**: [Причина]

**Рекомендуемое решение**:
```{{language}}
// С комментариями
```

---

## ✅ Positive Highlights

Отмеченные хорошо реализованные моменты:
- ✅ **[Название]**: [Почему это хорошо, например: "Использована debouncing для search input — защита от лишних запросов"]
- ✅ **[Название]**: [Почему это хорошо]

---

## 📋 Action Plan

### 🔴 Immediate Actions (до merge/деплоя):
- [ ] [BUG-1] — [Краткое описание]
- [ ] [BUG-2] — [Краткое описание]

### 🟠 Short-term Improvements (в течение спринта):
- [ ] [BUG-3] — [Краткое описание]
- [ ] [BUG-4] — [Краткое описание]

### 🟡 Long-term Optimizations (бэклог):
- [ ] [BUG-5] — [Краткое описание]
- [ ] [Tech Debt] — [Краткое описание]

---

## 🧪 Test Cases to Add

Рекомендуемые тесты для предотвращения регрессии:

### Unit Tests:
```{{language}}
describe('SubscribeForm', () => {
  it('должен блокировать кнопку во время отправки', async () => {
    // Test code
  });
  
  it('должен показывать ошибку при 500 от бэкенда', async () => {
    // Test code
  });
});
```

### Integration Tests:
```{{language}}
describe('Subscription Flow', () => {
  it('должен создавать одну подписку при быстром клике', async () => {
    // Test code
  });
});
```

### E2E Tests:
```{{language}}
describe('Subscription E2E', () => {
  it('полный цикл подписки', async () => {
    // Test code
  });
});
```

---

## 📚 References

- [Ссылка на документацию фреймворка]
- [Ссылка на best practices guide]
- [Ссылка на relevant CWE/OWASP если применимо]

[ADDITIONAL GUIDELINES]

### Принципы анализа:

1. **Systematic Thinking**: Не прыгай по коду хаотично. Иди последовательно: входные данные → трансформация → вывод → side effects

2. **State Transition Mapping**: Мысленно рисуй граф переходов состояний. Какое состояние было → событие → какое стало

3. **Async Reasoning**: Для async кода используй ментальную модель event loop: microtasks → macrotasks → render

4. **Defensive Mindset**: Всегда спрашивай "Что если...":
   - Что если пользователь нажмет 100 раз?
   - Что если API вернет null?
   - Что если сеть отвалится?
   - Что если данные придут в неправильном порядке?

5. **User-Centric**: Оценивай баги с точки зрения пользователя, а не разработчика. "Кнопка не работает" > "Неправильный state"

6. **Evidence-Based**: Не предполагай, а трассируй. Пошагово проходи код как debugger

7. **Trade-off Awareness**: При предложении решений учитывай компромиссы:
   - Производительность vs читаемость
   - Безопасность vs UX
   - Быстрое исправление vs архитектурно правильное

### Что НЕ делать:

- ❌ Не пиши общих фраз вроде "код можно улучшить"
- ❌ Не предлагай рефакторинг без явной проблемы
- ❌ Не игнорируй контекст (production code ≠ pet project)
- ❌ Не предполагай что бэкенд всегда работает идеально
- ❌ Не забывай про cleanup (memory leaks, event listeners)

[EXAMPLES]

### Пример входных данных:

```
{{code}}: |
  function SubscribeForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      setIsLoading(false);
      alert('Подписан!');
    };
    
    return (
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">
          {isLoading ? 'Отправка...' : 'Подписаться'}
        </button>
      </form>
    );
  }

{{language}}: "TypeScript"
{{app_type}}: "React SPA (Vite)"
{{expected_behavior}}: "Пользователь вводит email, нажимает 'Подписаться', отправляется POST /api/subscribe, показывается toast об успехе. Кнопка должна быть заблокирована во время отправки."
{{known_issues}}: "Иногда кнопка не блокируется при быстром клике"
{{environment}}: "React 18, Vite 5, Chrome 120+"
```

### Пример ожидаемого вывода (фрагмент):

```markdown
## 🎯 Executive Summary

**Общий вердикт**: Требует серьезных исправлений — найдены блокирующие баги

**Оценка качества**: 4/10 — Critical Issues Found

**Статистика дефектов**:
| Критичность | Количество | Блокирует релиз? |
|-------------|------------|------------------|
| 🔴 Blocker | 2 | Да |
| 🟠 Major | 3 | Да |
| 🟡 Minor | 1 | Нет |
| ⚪ Info | 2 | Нет |

**Top 3 критичных проблемы**:
1. **Отсутствие обработки ошибок API** — при 500 ошибке пользователь видит "Подписан!" вместо сообщения об ошибке
2. **Кнопка не блокируется от повторного клика** — race condition позволяет отправить N запросов
3. **Нет валидации email** — можно отправить пустую строку на бэкенд

---

## 📊 Bug Matrix

| # | Критичность | Компонент/Строка | Описание бага | Expected | Actual | Impact | Confidence | Способ исправления |
|---|-------------|------------------|---------------|----------|--------|--------|------------|-------------------|
| 1 | 🔴 Blocker | SubscribeForm.tsx:8-12 | Нет try/catch для fetch | Обработка ошибок | При 500 ошибке код падает с unhandled promise rejection | Пользователь не видит ошибку, данные теряются | High | Обернуть в try/catch, показать toast |
| 2 | 🔴 Blocker | SubscribeForm.tsx:15 | Кнопка не блокируется | disabled={isLoading} | Кнопка кликабельна, isLoading обновляется асинхронно | Дубликаты подписок, spam API | High | Добавить disabled + guard clause |
| 3 | 🟠 Major | SubscribeForm.tsx:10 | Нет проверки response.ok | Валидация ответа | response.json() вызывается даже при 400/500 | Падение с парсинг ошибкой | High | Добавить if (!response.ok) throw Error() |

---

## 🔍 Detailed Analysis by Phase

### Фаза 1: UI / UX & Интерактивность

#### [UI-001] Кнопка не блокируется от повторного клика (Race Condition)

**Критичность**: 🔴 Blocker  
**Локация**: SubscribeForm.tsx:15  
**Сценарий воспроизведения**:
```
Given: Пользователь на странице подписки
When:  Быстро кликает кнопку "Подписаться" 2 раза в первые 100ms
Then:  Отправляется 2 POST запроса, создаются дубликаты подписки
```

**Ментальная трассировка**:
```
1. T=0ms:   Клик #1 → handleSubmit() вызван
2. T=0ms:   setIsLoading(true) — state помечен но еще не применен!
3. T=10ms:  Клик #2 → handleSubmit() вызван СНОВА
            (isLoading все еще false в замыкании первого рендера!)
4. T=10ms:  Отправлен запрос #2
5. T=50ms:  React применяет state, isLoading = true
6. T=50ms:  UI обновляется, кнопка блокируется (но уже поздно!)
7. T=100ms: Запрос #1 возвращается
8. T=100ms: Запрос #2 возвращается
9. Result:  2 подписки созданы
```

**Root Cause**: React state updates асинхронны. Между вызовом setIsLoading и фактическим обновлением UI есть окно ~50-100ms когда кнопка еще кликабельна.

**Рекомендуемое решение**:
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Guard clause — защита от race condition
  if (isLoading) return;
  
  setIsLoading(true);
  try {
    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  } finally {
    setIsLoading(false);
  }
};

// В JSX:
<button 
  type="submit"
  disabled={isLoading}  // Блокируем на уровне DOM
  aria-busy={isLoading} // Accessibility
>
  {isLoading ? 'Отправка...' : 'Подписаться'}
</button>
```

**Почему это работает**: 
1. Guard clause `if (isLoading) return` отклоняет все повторные вызовы
2. `disabled={isLoading}` блокирует кнопку на уровне браузера (не только визуально)
3. `aria-busy` сообщает screen readers о состоянии загрузки
```

---

## Инструкция по использованию шаблона

### Шаг 1: Подготовка входных данных

Собери информацию для каждой переменной:

- `{{code}}`: Скопируй полный код модуля/компонента (включая импорты)
- `{{language}}`: Укажи язык и версию (TypeScript 5.x, Python 3.11, etc.)
- `{{app_type}}**: Опиши архитектуру (React SPA / FastAPI / Node.js microservice / CLI)
- `{{expected_behavior}}**: Детально опиши бизнес-логику — что должно происходить в идеале
- `{{target_files}}**: Если файлов много, укажи приоритетные для анализа
- `{{known_issues}}**: Перечисли известные проблемы которые нужно проверить
- `{{environment}}**: Production окружение (версии, браузеры, OS)

### Шаг 2: Заполнение переменных

Замени переменные шаблона на конкретные значения:

```
Оригинал: {{expected_behavior}}
Твой текст: "Пользователь вводит email, нажимает Submit, ..."
```

### Шаг 3: Настройка фокуса

Определи приоритеты анализа:

- **Полный аудит**: Оставь все 5 фаз
- **Быстрый check**: `{{skip_phases}}: "Фаза 5"` (пропустить environment)
- **Фокус на UI**: `{{skip_phases}}: "Фаза 3, Фаза 5"` (только UI и state)
- **API debugging**: `{{skip_phases}}: "Фаза 1"` (только backend анализ)

### Шаг 4: Выполнение

Отправь заполненный промпт AI модели. Для лучшего результата:

- Добавь контекст в начале ("Это production код, критичная фича")
- Укажи дедлайны если есть ("Нужно найти blocker-ы за 5 минут")
- Попроси фокус на конкретном типе багов ("Ищи race conditions")

### Шаг 5: Итерация

На основе результатов:

- Если анализ поверхностный — добавь больше контекста про бизнес-логику
- Если много false positives — уточни `{{known_issues}}` и `{{environment}}`
- Запроси детализацию по конкретным находкам ("Распиши подробнее про [BUG-1]")

---

## Варианты и модификации

### Вариант 1: Quick Smoke Test (5 минут)

**Модификация**:
- Прогони только Фазу 1 (UI) и Фазу 3 (API)
- Выведи только Blocker и Major проблемы
- Упрости output format до Bug Matrix + Quick Fixes

**Когда использовать**:
- Pre-merge check для небольших PR
- Срочные hotfix перед релизом
- Повторная проверка после исправлений

**Пример заполнения**:
```
{{skip_phases}}: "Фаза 2, Фаза 4, Фаза 5"
{{focus_severity}}: "Blocker, Major"
```

---

### Вариант 2: Deep Dive Debug (Production Incident)

**Модификация**:
- Расширь ментальную трассировку (пошагово, с таймингами)
- Добавь секцию "Timeline Incidents" (что происходило в production)
- Включи "Hypothesis Testing" (проверка теорий о root cause)
- Добавь "Rollback Plan" (как откатить если фикс не поможет)

**Когда использовать**:
- Production инциденты (site down, data loss)
- Критичные баги в payment/auth flows
- Расследование customer complaints

**Пример заполнения**:
```
{{expected_behavior}}: "Платеж должен проходить за 3 секунды, но пользователи жалуются на таймауты"
{{known_issues}}: "5% запросов завершаются timeout, паттерн не ясен"
```

---

### Вариант 3: Legacy Code Archaeology

**Модификация**:
- Добавь секцию "Code Intent Analysis" (что пытался сделать автор)
- Включи "Dependency Mapping" (как этот код связан с другими модулями)
- Добавь "Test Gap Analysis" (каких тестов не хватает)
- Расширь "Refactoring Recommendations" (поэтапный план)

**Когда использовать**:
- Анализ legacy кода без документации
- Подготовка к рефакторингу
- Onboarding нового разработчика

---

### Вариант 4: Security-Focused Debug

**Модификация**:
- Добавь OWASP Top 10 чеклист в каждую фазу
- Включи секцию "Attack Vector Analysis"
- Добавь "Data Flow Tracking" (откуда данные, куда уходят)
- Расширь "Input Validation" проверку

**Когда использовать**:
- Аудит auth/payment модулей
- Pre-release security review
- После penetration test findings

**Пример заполнения**:
```
{{focus_areas}}: "security, input-validation, data-protection"
{{compliance_requirements}}: "OWASP Top 10, PCI-DSS"
```

---

## Распространенные ошибки

### ❌ Ошибка 1: Слишком общий expected_behavior

**Плохо**: `{{expected_behavior}}: "Форма должна работать"`  
**Хорошо**: `{{expected_behavior}}: "Пользователь вводит email, валидация проверяет формат, при успехе отправляется POST /api/subscribe, показывается toast, кнопка разблокируется"`

### ❌ Ошибка 2: Отсутствие контекста окружения

**Плохо**: `{{environment}}: "production"`  
**Хорошо**: `{{environment}}: "React 18.2, Vite 5.0, Node.js 20.x, Chrome 120+, Safari 17+, API version 2.3"`

### ❌ Ошибка 3: Игнорирование known_issues

**Плохо**: Пропуск `{{known_issues}}` когда проблема известна  
**Хорошо**: `{{known_issues}}: "Кнопка иногда не блокируется, расследуем race condition"`

### ❌ Ошибка 4: Код без импортов

**Плохо**: Только функция без контекста  
**Хорошо**: Полный файл с импортами (чтобы видеть зависимости)

### ❌ Ошибка 5: Нет приоритетов

**Плохо**: Анализ всего кода без фокуса  
**Хорошо**: `{{target_files}}: "SubscribeForm.tsx (priority), api/subscription.ts (secondary)"`

---

## Оптимизация для лучших результатов

### Для ясности анализа:

- Описывай **пользовательские сценарии** (User Story формат)
- Добавляй **схемы потоков данных** если сложные
- Указывай **критичность фичи** (core business logic vs nice-to-have)

### Для точности находок:

- Предоставляй **полный контекст** (импорты, типы, зависимости)
- Описывай **production метрики** (RPS, latency, error rate)
- Включай **логи ошибок** если есть

### Для полезности решений:

- Указывай **ограничения** (дедлайны, technical debt, legacy compatibility)
- Описывай **existing patterns** в проекте (чтобы решения вписывались)
- Добавляй **acceptance criteria** для исправлений

---

## Чеклист тестирования шаблона

- [ ] Шаблон работает с минимальным input (только code + expected_behavior)
- [ ] Шаблон работает с комплексным input (все переменные заполнены)
- [ ] Edge cases обрабатываются (пустой код, невалидный синтаксис)
- [ ] Output format консистентный для разных языков
- [ ] Instructions понятны для Middle+ разработчиков
- [ ] Переменные хорошо документированы
- [ ] Примеры релевантны и полезны

### Тест кейсы:

1. **Простой случай**: Одна функция (10-20 строк) — поиск 1-2 багов
2. **Комплексный случай**: Модуль (100+ строк) — полный анализ по 5 фазам
3. **Edge case**: Код с намеренными багами — проверка что все найдены
4. **Error case**: Невалидный синтаксис/неполный код — graceful handling
5. **Production case**: Реальный инцидент — поиск root cause

---

## Библиотека шаблонов

Этот шаблон является частью коллекции:

```
prompts/templates/
├── technical/
│   ├── code-review-security-performance.md
│   ├── qa-debug-smoke-testing-mental-execution.md ← этот шаблон
│   ├── debugging-root-cause-analysis.md
│   └── architecture-design.md
├── qa-testing/
│   ├── test-case-generation.md
│   ├── e2e-test-planning.md
│   └── regression-checklist.md
├── security/
│   ├── threat-modeling-stride.md
│   ├── penetration-testing.md
│   └── compliance-audit.md
└── documentation/
    ├── api-docs-generator.md
    └── readme-creator.md
```

---

## Интеграция с workflow

### Pre-Merge Checklist:

```markdown
- [ ] Прогнать код через этот промпт
- [ ] Исправить все Blocker/Major проблемы
- [ ] Добавить unit tests для найденных багов
- [ ] Обновить документацию если изменилось поведение
```

### Production Incident Response:

```markdown
1. Скопировать проблемный код
2. Заполнить промпт с {{known_issues}} из логов
3. Получить анализ и Bug Matrix
4. Исправить Blocker проблемы
5. Задеплоить hotfix
6. Добавить regression tests
```

---

## Версионирование

**Версия**: 1.0.0  
**Дата создания**: 2026-03-23  
**Автор**: InfWIKI Prompt Library  
**Последнее обновление**: 2026-03-23

### Changelog:
- **1.0.0** (2026-03-23): Initial release — расширенная версия с 5 фазами анализа, mental execution methodology, Bug Matrix формат

---

## Лицензия

Этот шаблон распространяется под лицензией проекта InfWIKI. См. [LICENSE](../../LICENSE) для деталей.
