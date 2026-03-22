# 📚 InfWIKI — Бесконечная Энциклопедия Знаний

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-3.0.0-green.svg)
![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)
![PWA](https://img.shields.io/badge/PWA-Supported-00ff9d.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)

> 🌐 **Генерируйте энциклопедические статьи на русском и английском языках с помощью ИИ**

[Особенности](#-особенности) • [Быстрый старт](#-быстрый-старт) • [Архитектура](#-архитектура) • [Локальный ИИ](#-локальный-ии-ollama) • [Contributing](#-contributing)

</div>

---

## 📖 Оглавление

- [О проекте](#-о-проекте)
- [Особенности](#-особенности)
- [Быстрый старт](#-быстрый-старт)
- [Архитектура](#-архитектура)
- [Локальный ИИ (Ollama)](#-локальный-ии-ollama)
- [Функции](#-функции)
- [Технологии](#-технологии)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 О проекте

**InfWIKI** — это Progressive Web App, которое генерирует энциклопедические определения в реальном времени с помощью больших языковых моделей. Проект поддерживает работу как с облачными моделями (Google Gemini), так и с локальными (Ollama), обеспечивая полную приватность данных.

### Ключевые возможности

| Возможность | Описание |
|-------------|----------|
| 🤖 **Два LLM провайдера** | Gemini API (облако) или Ollama (локально) |
| 🌐 **Мультиязычность** | Полная поддержка 🇷🇺 русского и 🇬🇧 английского |
| 📱 **PWA** | Установка как приложение, офлайн-режим |
| 🎨 **ASCII-арт** | Визуализация концепций в ASCII |
| 📄 **Экспорт** | PDF, Markdown, буфер обмена |
| 🔔 **Уведомления** | Push-уведомления о новых статьях |

---

## ✨ Особенности

### Основная функциональность

| Функция | Описание |
|---------|----------|
| 🤖 **AI-Генерация** | Потоковая генерация определений через Gemini или Ollama |
| 🌐 **Мультиязычность** | i18n с поддержкой ru/en и автоопределением языка |
| 📱 **PWA** | Service Worker, офлайн-режим, установка на устройство |
| 🎤 **Голосовой ввод** | Поиск статей голосом (Web Speech API) |
| 📄 **PDF Экспорт** | Печать и сохранение в PDF через браузерный API |
| 📝 **Markdown Экспорт** | Сохранение статей в .md формате |
| 🎨 **3 Темы** | Светлая, Тёмная, Киберпанк с неоновыми эффектами |
| 📊 **Статистика** | Просмотры, поиски, стрики, популярные темы |
| 🔔 **Push-уведомления** | Браузерные уведомления о новых статьях |
| 🏷️ **Категории** | 8 категорий: Наука, Технологии, История, Культура... |
| ⭐ **Избранное** | Закладки с экспортом/импортом в JSON |
| 📜 **История** | Навигация назад/вперёд по просмотренным статьям |
| 🎨 **ASCII-арт** | Генерация визуализаций через LLM |

### Горячие клавиши

| Клавиша | Действие |
|---------|----------|
| `Alt + ←` | Назад в истории |
| `Alt + →` | Вперёд в истории |
| `Ctrl + B` | Добавить в избранное |
| `Ctrl + E` | Экспорт статьи |
| `Ctrl + S` | Голосовой поиск |

---

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** >= 20.x
- **npm** >= 9.x
- **Docker** (опционально)

### Установка и запуск

```bash
# Клонирование репозитория
git clone https://github.com/motttik/InfWIKI.git
cd InfWIKI

# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Production сборка
npm run build
npm run preview
```

### Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

#### Минимальная конфигурация (Gemini)

```bash
# Gemini API Key (получите на https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_api_key_here

# Режим работы
VITE_APP_MODE=development
```

### Docker

```bash
# Production сборка и запуск
docker-compose up --build

# Development режим с hot-reload
docker-compose --profile dev up

# Остановка
docker-compose down
```

---

## 🏗️ Архитектура

### Общая схема

```
┌─────────────────────────────────────────────────────────────────┐
│                        InfWIKI Application                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React 19  │  │ TypeScript  │  │      Vite 6.2           │  │
│  │   (Frontend)│  │  (Strict)   │  │      (Build)            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────▼──────────────────────────────┐   │
│  │                    useWiki Hook                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐   │   │
│  │  │   Content    │  │   ASCII Art  │  │   History     │   │   │
│  │  │   Streaming  │  │  Generation  │  │   Bookmarks   │   │   │
│  │  └──────────────┘  └──────────────┘  └───────────────┘   │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────▼──────────────────────────────┐   │
│  │                  LLM Service Factory                      │   │
│  │         (GeminiService / OllamaService)                   │   │
│  └───────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
     ┌────────▼────────┐              ┌────────▼────────┐
     │  Google Gemini  │              │    Ollama       │
     │     (Cloud)     │              │   (Local)       │
     │  gemini-2.5-*   │              │ llama3.2:3b+    │
     └─────────────────┘              └─────────────────┘
```

### Структура проекта

```
InfWIKI/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Footer, Layout компоненты
│   │   ├── ui/              # Button, Input, Card - базовые UI элементы
│   │   └── wiki/            # SearchBar, ContentDisplay, AsciiArtDisplay
│   ├── hooks/
│   │   ├── useWiki.ts       # Основной хук для работы с LLM
│   │   ├── useTheme.ts      # Управление темами оформления
│   │   ├── useBookmarks.ts  # Управление закладками
│   │   └── useNavigationHistory.ts  # История навигации
│   ├── services/
│   │   ├── llmService.ts    # Фабрика LLM сервисов (Gemini/Ollama)
│   │   ├── geminiService.ts # Gemini API клиент
│   │   └── pdfExport.ts     # Экспорт в PDF
│   ├── i18n/
│   │   ├── ru.json          # Русская локализация
│   │   ├── en.json          # Английская локализация
│   │   └── index.ts         # i18next конфигурация
│   ├── types/
│   │   └── index.ts         # TypeScript типы и интерфейсы
│   ├── utils/
│   │   └── ...              # Вспомогательные функции
│   ├── store/
│   │   └── ...              # Глобальное состояние (если нужно)
│   └── styles/
│       └── ...              # Глобальные стили, темы
├── public/
│   ├── manifest.json        # PWA манифест
│   ├── sw.js               # Service Worker для офлайн-режима
│   └── icons/              # PWA иконки (192x192, 512x512)
├── tests/                  # Vitest тесты
├── .github/workflows/      # CI/CD пайплайны
├── docker-compose.yml      # Docker конфигурация
├── Dockerfile              # Production Docker образ
├── vite.config.ts          # Vite конфигурация с alias
└── tsconfig.json           # TypeScript конфигурация
```

### Модульная архитектура LLM

Проект использует **фабричный паттерн** для поддержки нескольких LLM провайдеров:

```typescript
// src/services/llmService.ts

interface LLMService {
  streamDefinition(topic: string, language: Language): AsyncGenerator<string>
  getRandomWord(language: Language): Promise<string>
  generateAsciiArt(topic: string, language: Language): Promise<AsciiArtData>
}

// Фабрика создаёт нужный сервис на основе конфигурации
export function createLLMService(config?: LLMProviderConfig): LLMService {
  const provider = config?.provider || 'gemini'
  
  switch (provider) {
    case 'ollama':
      return new OllamaService()
    case 'gemini':
    default:
      return new GeminiService()
  }
}
```

### Поток данных

```
User Input → useWiki Hook → LLM Service → API Response → Stream → UI
                │                                      │
                ├─→ History Management                 ├─→ ASCII Art
                ├─→ Bookmarks                          └─→ Content
                └─→ Statistics
```

---

## 🧠 Локальный ИИ (Ollama)

InfWIKI поддерживает работу с **локальными LLM** через [Ollama](https://ollama.ai), что обеспечивает:

- 🔒 **Полную приватность** — данные не покидают ваше устройство
- 💰 **Бесплатное использование** — нет лимитов API
- 🚀 **Работу офлайн** — генерация без интернета
- ⚡ **Низкую задержку** — нет сетевых запросов

### Установка Ollama

#### Linux

```bash
# Установка
curl -fsSL https://ollama.ai/install.sh | sh

# Запуск сервиса
ollama serve

# Проверка
ollama --version
```

#### macOS

```bash
# Homebrew
brew install ollama

# Или скачать с https://ollama.ai/download
```

#### Windows

Скачайте установщик с [ollama.ai/download](https://ollama.ai/download)

### Рекомендованные модели (2025-2026)

#### Топ моделей для WIKI-статей на русском языке

| Модель | Размер | VRAM (мин) | VRAM (рек) | Скорость | Качество RU | Описание |
|--------|--------|------------|------------|----------|-------------|----------|
| **qwen3:8b** | 8 GB | 10 GB | 14 GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | Лучшая для русского языка (2026) |
| **qwen3:14b** | 14 GB | 16 GB | 24 GB | ⚡ | ⭐⭐⭐⭐⭐ | Премиум качество, энциклопедии |
| **qwen2.5:7b** | 4 GB | 6 GB | 8 GB | ⚡⚡ | ⭐⭐⭐⭐ | Отличная поддержка ru/en |
| **qwen2.5:14b** | 8 GB | 10 GB | 12 GB | ⚡ | ⭐⭐⭐⭐⭐ | Высокое качество, русский язык |
| **deepseek-r1:8b** | 8 GB | 10 GB | 14 GB | ⚡⚡ | ⭐⭐⭐⭐ | Reasoning модель, точные факты |
| **llama3.2:3b** | 2 GB | 4 GB | 6 GB | ⚡⚡⚡ | ⭐⭐⭐ | Быстрая, для слабых GPU |
| **llama3.1:8b** | 5 GB | 8 GB | 10 GB | ⚡⚡ | ⭐⭐⭐⭐ | Универсальная модель |
| **mistral:7b** | 4 GB | 6 GB | 8 GB | ⚡⚡ | ⭐⭐⭐ | Баланс скорости и качества |
| **gemma3:4b** | 4 GB | 6 GB | 8 GB | ⚡⚡ | ⭐⭐⭐ | Хорошая для технических тем |
| **phi3:mini** | 2 GB | 4 GB | 6 GB | ⚡⚡⚡ | ⭐⭐ | Компактная от Microsoft |

#### Формула расчёта VRAM

| Точность | Формула | Пример для 8B |
|----------|---------|---------------|
| **FP16** | Параметры × 2 байта | 8B × 2 = **16 GB** |
| **INT8** | Параметры × 1 байт | 8B × 1 = **8 GB** |
| **INT4** | Параметры × 0.5 байта | 8B × 0.5 = **4 GB** |

> 💡 **Рекомендация для русского языка:** 
> - **Топ выбор:** `qwen3:8b` или `qwen3:14b` — наилучшее качество русского языка (2026)
> - **Баланс:** `qwen2.5:7b` — отличное качество при умеренных требованиях
> - **Бюджетный:** `llama3.2:3b` — для систем с 4-6 GB VRAM

### Загрузка моделей

```bash
# Базовая модель (рекомендуется для начала)
ollama pull llama3.2:3b

# Модель с отличной поддержкой русского
ollama pull qwen2.5:7b

# Альтернатива от Mistral AI
ollama pull mistral:7b

# Проверка загруженных моделей
ollama list
```

### Настройка InfWIKI для Ollama

#### Шаг 1: Обновите `.env`

```bash
# Отключить Gemini (опционально)
# GEMINI_API_KEY=your_api_key_here

# Включить Ollama
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=qwen2.5:7b

# Режим работы
VITE_APP_MODE=development
```

#### Шаг 2: Запустите Ollama

```bash
# Запуск сервиса (если не запущен)
ollama serve

# В отдельном терминале проверьте доступность
curl http://localhost:11434/api/tags
```

#### Шаг 3: Запустите InfWIKI

```bash
npm run dev
```

### Переключение между Gemini и Ollama

#### Через переменные окружения

| Провайдер | GEMINI_API_KEY | VITE_OLLAMA_BASE_URL | VITE_OLLAMA_MODEL |
|-----------|----------------|----------------------|-------------------|
| **Gemini** | `your_key` | (не важно) | (не важно) |
| **Ollama** | (не важно) | `http://localhost:11434` | `qwen2.5:7b` |

#### Через код (программно)

```typescript
// src/hooks/useWiki.ts

import { createLLMService } from '../services/llmService'

// Использование Gemini
const geminiService = createLLMService({ provider: 'gemini' })

// Использование Ollama
const ollamaService = createLLMService({ 
  provider: 'ollama',
  baseUrl: 'http://localhost:11434',
  model: 'qwen2.5:7b'
})

// В хуке useWiki
const llmService = useRef(createLLMService(llmConfig)).current
```

#### Динамическое переключение в UI

Добавьте селектор провайдера в настройки:

```typescript
// Пример конфигурации
const llmConfig: LLMProviderConfig = {
  provider: selectedProvider, // 'gemini' | 'ollama'
  apiKey: selectedProvider === 'gemini' ? geminiKey : undefined,
  baseUrl: selectedProvider === 'ollama' ? 'http://localhost:11434' : undefined,
  model: selectedProvider === 'ollama' ? 'qwen2.5:7b' : undefined,
}
```

### Диагностика проблем

#### Ollama не отвечает

```bash
# Проверка статуса сервиса
systemctl status ollama

# Перезапуск
ollama serve

# Проверка доступности
curl http://localhost:11434/api/tags
```

#### Модель не загружена

```bash
# Проверка списка моделей
ollama list

# Загрузка нужной модели
ollama pull qwen2.5:7b
```

#### Недостаточно VRAM

```bash
# Проверка использования GPU
nvidia-smi  # Для NVIDIA
radeontop   # Для AMD

# Используйте меньшую модель
ollama pull llama3.2:3b
```

### Сравнение провайдеров

| Критерий | Gemini | Ollama |
|----------|--------|--------|
| **Стоимость** | Платно (лимиты) | Бесплатно |
| **Приватность** | Данные в Google | Локально |
| **Скорость** | Зависит от сети | Мгновенно |
| **Качество** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Офлайн** | ❌ | ✅ |
| **Настройка** | Минимальная | Требует GPU |
| **Модели** | Фиксированные | Любые из Ollama |

---

## 📱 PWA Возможности

InfWIKI — это Progressive Web App с полным набором возможностей:

### Установка

- **Desktop**: Кнопка установки в браузере
- **Mobile**: "Добавить на главный экран"
- **Offline**: Работа без интернета (кэшированные статьи)

### Service Worker

- Автоматическое кэширование ресурсов
- Фоновая синхронизация
- Push-уведомления

---

## 🎤 Голосовой ввод

Нажмите на кнопку 🎤 рядом с поиском и произнесите тему:

```
"Квантовая физика"
"Теория относительности"
"Чёрные дыры"
```

Поддерживаемые языки:
- 🇷🇺 Русский (ru-RU)
- 🇬🇧 English (en-US)

---

## 📄 Экспорт статей

### Форматы экспорта

| Формат | Описание |
|--------|----------|
| 📄 **PDF** | Печать или сохранение в PDF |
| 📝 **Markdown** | .md файл для заметок |
| 📋 **Clipboard** | Копирование в буфер |

### Использование

1. Откройте статью
2. Нажмите "📤 Экспорт"
3. Выберите формат

---

## 📊 Статистика и Аналитика

InfWIKI отслеживает:

- 👁️ **Просмотры** — общее количество просмотров
- 🔍 **Поиски** — количество поисковых запросов
- ⭐ **Избранное** — сохранённые закладки
- 🔥 **Стрик** — дней подряд в приложении
- 📚 **Темы** — количество просмотренных тем
- ⏱️ **Время** — время в сессии

### Популярные темы

Автоматический список наиболее просматриваемых тем.

---

## 🏷️ Категории и Теги

Автоматическая категоризация тем:

| Категория | Примеры |
|-----------|---------|
| 🔬 Наука | Квант, Энтропия, Гравитация |
| 💻 Технологии | Интернет, ИИ, Компьютер |
| 📜 История | Революция, Империя, Война |
| 🎨 Культура | Искусство, Музыка, Литература |
| 🤔 Философия | Баланс, Гармония, Нигилизм |
| 🌿 Природа | Океан, Лес, Гора |
| 🚀 Космос | Звезда, Галактика, Вселенная |
| 📐 Математика | Фрактал, Спираль, Интеграл |

---

## 🎨 Темы оформления

### Светлая (Light)
- Чистый белый фон
- Тёмно-синий текст
- Фиолетовые акценты

### Тёмная (Dark)
- Тёмно-синий фон
- Светлый текст
- Мягкие переходы

### Киберпанк (Cyberpunk)
- Чёрный фон
- Неоновые цвета
- Светящиеся эффекты

---

## 🔔 Уведомления

Включите push-уведомления для:

- 📚 Новые статьи по интересам
- 💡 Совет дня
- 🔥 Напоминания о стрике

---

## 🛠️ Технологии

<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg?logo=vite)
![i18next](https://img.shields.io/badge/i18next-23.11-26a69a.svg)
![Gemini](https://img.shields.io/badge/Gemini_API-2.5-4285F4.svg?logo=google)
![Ollama](https://img.shields.io/badge/Ollama-Supported-00cc66.svg)
![Vitest](https://img.shields.io/badge/Vitest-1.6-6e9f1a.svg)
![Docker](https://img.shields.io/badge/Docker-Latest-2496ed.svg?logo=docker)

</div>

### Стек технологий

| Технология | Версия | Назначение |
|------------|--------|------------|
| **React** | 19.1.0 | UI библиотека |
| **TypeScript** | 5.8 | Строгая типизация |
| **Vite** | 6.2 | Сборка и dev-сервер |
| **i18next** | 23.11 | Локализация (ru/en) |
| **Gemini API** | 2.5 | Облачная LLM |
| **Ollama** | Latest | Локальная LLM |
| **Vitest** | 1.6 | Тестирование |
| **Service Worker** | Native | PWA офлайн-режим |

---

## 🧪 Тесты

```bash
# Запуск тестов
npm run test

# Тесты с UI
npm run test:ui

# Покрытие
npm run test:coverage
```

Покрытие тестами: **>80%**

---

## 🤝 Contributing

Приветствуется любой вклад!

### Как помочь

1. **Форк** репозиторий
2. Создай **ветку** (`git checkout -b feature/amazing-feature`)
3. **Закоммить** изменения (`git commit -m "feat: add amazing feature"`)
4. **Пуш** (`git push origin feature/amazing-feature`)
5. Открой **Pull Request**

### Стандарты кода

- 📝 **Docstrings** для всех функций (JSDoc)
- 🧪 **Тесты** для нового функционала
- 📋 **TypeScript strict mode** обязателен
- 🔤 **Коммиты** на английском (Conventional Commits)
- 🎨 **ESLint** без ошибок

### Conventional Commits

```
feat: добавление новой функции
fix: исправление ошибки
docs: обновление документации
style: форматирование кода
refactor: рефакторинг без изменений функционала
test: добавление тестов
chore: обновление зависимостей, конфигураций
```

---

## 📄 License

MIT License — см. [LICENSE](LICENSE) файл.

---

## 📞 Контакты

| 📧 GitHub |
|-----------|
| [@motttik](https://github.com/motttik) |

---

## 🙏 Благодарности

- 🌟 **Google** — за Gemini API
- 🦙 **Ollama** — за локальные LLM
- 💎 **Rich Library** — за вдохновение
- 👨‍💻 **Всем контрибьюторам** — за помощь

---

<div align="center">

### ⭐ Если понравился проект — поставь звезду!

**InfWIKI** © 2026 | Сделано с ❤️ для любителей знаний

```
   _____ _______ _____  ______ _____ 
  / ____|__   __|  __ \|  ____|  __ \
 | (___    | |  | |__) | |__  | |__) |
  \___ \   | |  |  ___/|  __| |  _  /
  ____) |  | |  | |    | |____| | \ \
 |_____/   |_|  |_|    |______|_|  \_\
 
  Infinite Knowledge • Powered by AI
```

</div>
