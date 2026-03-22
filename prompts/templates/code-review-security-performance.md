# Шаблон промпта: Code Review (Security + Performance)

## Метаданные шаблона

**Название**: `code-review-security-performance`

**Категория**: Technical / Code Review / Security Analysis

**Назначение**: Комплексный анализ кода с фокусом на уязвимости безопасности, производительность и лучшие практики

**Варианты использования**:
- Ревью кода перед merge в production
- Аудит безопасности нового функционала
- Оптимизация критичных по производительности участков
- Обучение разработчиков лучшим практикам
- Подготовка к релизу

**Целевая аудитория**:
- **Уровень**: Middle+ разработчики, Tech Leads, Security Engineers
- **Роль**: Code reviewers, архитекторы, senior разработчики
- **Контекст**: Production код, критичные компоненты, API endpoints

---

## Переменные шаблона

### Обязательные переменные:
- `{{code}}`: Анализируемый код (полный файл или фрагмент)
- `{{language}}`: Язык программирования (TypeScript, Python, Go, etc.)
- `{{context}}`: Описание функциональности кода (что делает этот компонент)

### Опциональные переменные:
- `{{focus_areas}}`: Приоритетные области анализа (по умолчанию: все)
- `{{compliance_requirements}}`: Стандарты соответствия (OWASP, PCI-DSS, GDPR) (по умолчанию: OWASP Top 10)
- `{{performance_thresholds}}`: Требования к производительности (по умолчанию: best practices)
- `{{ignore_patterns}}`: Паттерны для игнорирования (false positives) (по умолчанию: none)

### Пример значений:
```
{{code}}: "async function authenticateUser(username: string, password: string) { ... }"
{{language}}: "TypeScript"
{{context}}: "Функция аутентификации пользователя с проверкой учетных данных"
{{focus_areas}}: "security, performance, error-handling"
{{compliance_requirements}}: "OWASP Top 10, CWE Top 25"
{{performance_thresholds}}: "Response time < 100ms, no N+1 queries"
{{ignore_patterns}}: "console.log в development режиме"
```

---

## Шаблон промпта

```markdown
[ROLE/CONTEXT]
Ты — Senior Security Engineer и Performance Architect с 10+ годами опыта в {{language}} разработке. Твоя специализация — поиск уязвимостей безопасности, оптимизация производительности и обеспечение качества кода в production-системах с высокой нагрузкой.

[OBJECTIVE]
Твоя задача — провести глубокий экспертный анализ предоставленного кода с фокусом на:
1. **Безопасность**: Выявление уязвимостей и векторов атак
2. **Производительность**: Поиск узких мест и неоптимальных решений
3. **Надежность**: Обработка ошибок, edge cases, отказоустойчивость
4. **Поддерживаемость**: Читаемость, тестируемость, соответствие best practices

[INPUT CONTEXT]
**Язык**: {{language}}
**Описание функциональности**: {{context}}
**Код для анализа**:
```{{language}}
{{code}}
```

[FOCUS AREAS]
{{if focus_areas}}
Приоритетные области анализа: {{focus_areas}}
{{else}}
Проведи полный анализ по всем направлениям (security, performance, reliability, maintainability)
{{endif}}

[COMPLIANCE REQUIREMENTS]
{{if compliance_requirements}}
Проверь соответствие стандартам: {{compliance_requirements}}
{{else}}
Используй OWASP Top 10 как базовый стандарт безопасности
{{endif}}

[PERFORMANCE THRESHOLDS]
{{if performance_thresholds}}
Требования к производительности: {{performance_thresholds}}
{{else}}
Применяй industry best practices для данного типа операций
{{endif}}

[CONSTRAINTS/REQUIREMENTS]
При анализе обеспечь:
1. **Глубина анализа**: Не просто перечисляй проблемы, а объясняй механизм уязвимости/неоптимальности
2. **Доказательность**: Для каждой проблемы указывай конкретную строку кода и CWE/CVE (если применимо)
3. **Приоритизация**: Классифицируй проблемы по критичности (Critical, High, Medium, Low, Info)
4. **Решения**: Для каждой проблемы предлагай конкретный исправленный код с объяснением
5. **Контекстуальность**: Учитывай специфику {{language}} экосистемы и фреймворков
6. **False Positive Filter**: {{if ignore_patterns}}Игнорируй: {{ignore_patterns}}{{else}}Не отмечай ложные срабатывания{{endif}}
7. **Positive Highlights**: Отмечай хорошо реализованные моменты и best practices

[OUTPUT FORMAT]
Предоставь ответ в следующей структуре:

## 🔍 Executive Summary
**Общая оценка**: [1-10] / [Краткая характеристика: "Production Ready", "Needs Improvements", "Critical Issues Found"]

**Статистика находок**:
| Критичность | Количество |
|-------------|------------|
| 🔴 Critical | X |
| 🟠 High | X |
| 🟡 Medium | X |
| 🔵 Low | X |
| ⚪ Info | X |

**Top 3 приоритета**:
1. [Самая критичная проблема]
2. [Вторая по важности]
3. [Третья по важности]

---

## 🛡️ Security Analysis

### [SEC-XXX] Название уязвимости
**Критичность**: [Critical/High/Medium/Low]  
**CWE/CVE**: [CWE-XXX если применимо]  
**Локация**: Строка X-Y  
**Описание**: Подробное объяснение уязвимости и вектора атаки

**Proof of Concept** (если применимо):
```
[Пример эксплуатации уязвимости]
```

**Рекомендуемое решение**:
```{{language}}
[Исправленный код с комментариями]
```

**Почему это работает**: Объяснение механизма защиты

---

## ⚡ Performance Analysis

### [PERF-XXX] Название проблемы
**Влияние**: [High/Medium/Low]  
**Локация**: Строка X-Y  
**Описание**: Какая операция неоптимальна и почему

**Метрики**:
- Текущая сложность: O(X)
- Ожидаемая сложность: O(Y)
- Влияние на latency: +X ms при Y запросах/сек

**Рекомендуемое решение**:
```{{language}}
[Оптимизированный код]
```

**Benchmark** (если применимо):
```
Before: X ops/sec
After:  Y ops/sec (+Z% improvement)
```

---

## 🏗️ Code Quality & Best Practices

### [QUAL-XXX] Название замечания
**Категория**: [Maintainability/Readability/Testability/Architecture]  
**Локация**: Строка X-Y  

**Проблема**: Описание нарушения best practices

**Рекомендация**:
```{{language}}
[Улучшенная версия кода]
```

---

## ✅ Positive Highlights
Отмеченные хорошо реализованные моменты:
- ✅ [Момент 1]: Почему это хорошо
- ✅ [Момент 2]: Почему это хорошо

---

## 📋 Action Plan

### Immediate Actions (до merge):
- [ ] [Critical/High проблемы — обязательно к исправлению]

### Short-term Improvements (в течение спринта):
- [ ] [Medium проблемы — желательно исправить]

### Long-term Optimizations (бэклог):
- [ ] [Low/Info улучшения — по возможности]

---

## 📚 References
- [Ссылка на документацию/стандарт 1]
- [Ссылка на документацию/стандарт 2]
- [Ссылка на relevant CWE/CVE]

[ADDITIONAL GUIDELINES]
- Используй точную техническую терминологию
- Избегай общих фраз вроде "это может быть проблемой" — будь конкретен
- Если проблема гипотетическая и маловероятная, помечай это явно
- Для security issues всегда указывай реальный вектор атаки, а не теоретическую возможность
- При предложении решений учитывай trade-offs (производительность vs читаемость, безопасность vs UX)
- Если код требует рефакторинга, предлагай постепенные изменения, а не полный rewrite
- Отмечай, если проблема требует архитектурных изменений на уровне системы

[EXAMPLES]

### Пример входных данных:
```
{{code}}: |
  async function getUserData(userId: string) {
    const query = `SELECT * FROM users WHERE id = '${userId}'`;
    const result = await db.query(query);
    return result.rows[0];
  }

{{language}}: "TypeScript"
{{context}}: "API endpoint для получения данных пользователя по ID"
{{focus_areas}}: "security, performance"
{{compliance_requirements}}: "OWASP Top 10"
```

### Пример ожидаемого вывода:
```markdown
## 🔍 Executive Summary
**Общая оценка**: 3/10 — Critical Security Issues Found

**Статистика находок**:
| Критичность | Количество |
|-------------|------------|
| 🔴 Critical | 1 |
| 🟠 High | 0 |
| 🟡 Medium | 1 |
| 🔵 Low | 0 |
| ⚪ Info | 1 |

**Top 3 приоритета**:
1. SQL Injection уязвимость в query construction
2. Отсутствие обработки случая, когда пользователь не найден
3. Нет лимита на количество возвращаемых записей

---

## 🛡️ Security Analysis

### [SEC-001] SQL Injection
**Критичность**: Critical  
**CWE**: CWE-89 (SQL Injection)  
**Локация**: Строка 2  

**Описание**: Прямая интерполяция пользовательского ввода `userId` в SQL query позволяет злоумышленнику выполнять произвольные SQL команды.

**Proof of Concept**:
```
GET /api/user/1' OR '1'='1' --
Вернет всех пользователей из таблицы
```

**Рекомендуемое решение**:
```typescript
async function getUserData(userId: string) {
  // Используем параметризованный запрос
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [userId]);
  return result.rows[0] || null;
}
```

**Почему это работает**: Параметризованные запросы разделяют код SQL и данные, предотвращая инъекции.

---

## 🏗️ Code Quality & Best Practices

### [QUAL-001] Отсутствие обработки null
**Категория**: Reliability  
**Локация**: Строка 4  

**Проблема**: Если пользователь не найден, `result.rows[0]` вернет `undefined`, что может вызвать ошибки в вышестоящем коде.

**Рекомендация**:
```typescript
return result.rows[0] || null; // Явно возвращаем null
```
```

---

## Инструкция по использованию шаблона

### Шаг 1: Подготовка входных данных
Собери информацию для каждой переменной:
- `{{code}}`: Скопируй код для анализа (файл, функцию, класс)
- `{{language}}`: Укажи язык и версию (например, "TypeScript 5.x")
- `{{context}}`: Опиши, что делает код, в каком контексте используется
- `{{focus_areas}}`: Определи приоритеты (security/performance/architecture)
- `{{compliance_requirements}}`: Укажи стандарты если нужны (OWASP, PCI-DSS)

### Шаг 2: Заполнение переменных
Замени переменные шаблона на конкретные значения:
```
Оригинал: {{code}}
Твой код: [вставь код]
```

### Шаг 3: Настройка фокуса
Если нужен специфичный анализ:
- Только security: `{{focus_areas}}: "security, compliance"`
- Только performance: `{{focus_areas}}: "performance, benchmarking"`
- Полный аудит: оставь по умолчанию

### Шаг 4: Выполнение
Отправь заполненный промпт AI модели.

### Шаг 5: Итерация
На основе результатов:
- Добавь контекст если анализ был поверхностным
- Уточни `{{ignore_patterns}}` для фильтрации false positives
- Запроси детализацию по конкретным находкам

---

## Варианты и модификации

### Вариант 1: Quick Review (быстрое ревью)
**Модификация**:
- Убери секции [Performance Analysis] и [Code Quality]
- Оставь только [Security Analysis] с Critical/High issues
- Упрости output format до списка проблем с решениями

**Когда использовать**:
- Pre-merge check для небольших PR
- Срочные hotfix ревью
- Повторное ревью после исправлений

### Вариант 2: Deep Dive Security Audit
**Модификация**:
- Добавь секцию [Threat Modeling] с STRIDE анализом
- Включи [Attack Surface Analysis]
- Добавь [Compliance Mapping] по стандартам
- Расширь [Proof of Concept] для каждой уязвимости

**Когда использовать**:
- Аудит критичных компонентов (auth, payments)
- Pre-production security review
- Compliance аудит (SOC2, ISO 27001)

### Вариант 3: Performance Optimization Focus
**Модификация**:
- Расширь секцию [Performance Analysis]
- Добавь [Benchmarking Plan] с метриками
- Включи [Profiling Recommendations]
- Добавь [Scaling Considerations]

**Когда использовать**:
- Оптимизация узких мест
- Подготовка к масштабированию
- Response на performance инциденты

---

## Распространенные ошибки

### ❌ Ошибка 1: Слишком общий контекст
**Плохо**: `{{context}}: "Функция для API"`  
**Хорошо**: `{{context}}: "REST API endpoint POST /auth/login для аутентификации пользователя, вызывается 1000+ раз/минуту"`

### ❌ Ошибка 2: Отсутствие приоритетов
**Плохо**: `{{focus_areas}}: "everything"`  
**Хорошо**: `{{focus_areas}}: "security (priority), performance, error-handling"`

### ❌ Ошибка 3: Игнорирование compliance
**Плохо**: Пропуск `{{compliance_requirements}}` для fintech кода  
**Хорошо**: `{{compliance_requirements}}: "PCI-DSS, OWASP ASVS Level 2"`

### ❌ Ошибка 4: Код без контекста
**Плохо**: Только код без описания  
**Хорошо**: Код + описание бизнес-логики + ожидаемое поведение

---

## Оптимизация для лучших результатов

### Для ясности:
- Указывай версию языка и фреймворков
- Добавляй ссылки на связанные файлы/типы
- Описывай ожидаемое поведение vs фактическое

### Для точности анализа:
- Предоставляй полный контекст (импорты, зависимости)
- Указывай объем данных (сколько записей, какой трафик)
- Описывай окружение (production, staging, local)

### Для полезности решений:
- Указывай ограничения (дедлайны, technical debt)
- Описывай已有的 решения которые нельзя менять
- Добавляй acceptance criteria для исправлений

---

## Чеклист тестирования шаблона

- [ ] Шаблон работает с минимальным input (только code + language)
- [ ] Шаблон работает с комплексным input (все переменные заполнены)
- [ ] Edge cases обрабатываются (пустой код, невалидный синтаксис)
- [ ] Output format консистентный для разных языков
- [ ] Instructions понятны для Middle+ разработчиков
- [ ] Переменные хорошо документированы
- [ ] Примеры релевантны и полезны

### Тест кейсы:

1. **Простой случай**: Маленькая функция (10-20 строк)
2. **Комплексный случай**: Класс/модуль (100+ строк)
3. **Edge case**: Код с намеренными уязвимостями
4. **Error case**: Невалидный синтаксис/неполный код

---

## Библиотека шаблонов

Этот шаблон является частью коллекции:

```
prompts/templates/
├── technical/
│   ├── code-review-security-performance.md ← этот шаблон
│   ├── code-review-best-practices.md
│   ├── debugging-root-cause.md
│   └── architecture-design.md
├── security/
│   ├── threat-modeling-stride.md
│   ├── penetration-testing.md
│   └── compliance-audit.md
├── performance/
│   ├── profiling-optimization.md
│   └── benchmark-analysis.md
└── documentation/
    ├── api-docs-generator.md
    └── readme-creator.md
```

---

## Версионирование

**Версия**: 1.0.0  
**Дата создания**: 2026-03-23  
**Автор**: InfWIKI Prompt Library  
**Последнее обновление**: 2026-03-23

### Changelog:
- **1.0.0** (2026-03-23): Initial release

---

## Лицензия

Этот шаблон распространяется под лицензией проекта InfWIKI. См. [LICENSE](../../LICENSE) для деталей.
