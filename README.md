# 📚 InfWIKI — Бесконечная Энциклопедия Знаний

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Stars](https://img.shields.io/badge/stars-⭐-yellow.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen.svg)

> 🌐 **Генерируйте энциклопедические статьи на русском и английском языках с помощью ИИ**

[Особенности](#-особенности) • [Быстрый старт](#-быстрый-старт) • [Документация](#-документация) • [Roadmap](#-roadmap) • [Contributing](#-contributing)

</div>

---

## 📖 О Проекте

**InfWIKI** — это инновационное приложение, которое использует мощь **Google Gemini API** для генерации энциклопедических статей любого объёма. Получите мгновенный доступ к знаниям на двух языках с красивым ASCII-артом и структурированным контентом.

### 🎯 Зачем это нужно?

- 🚀 Быстрое получение информации по любой теме
- 🌍 Поддержка русского и английского языков
- 🎨 Уникальный ASCII-арт для каждой статьи
- 💾 Сохранение статей для офлайн-чтения
- 🔍 Умный поиск по сохранённым материалам

---

## ✨ Особенности

| Функция | Описание |
|---------|----------|
| 🤖 **AI-Генерация** | Использование Gemini API для создания качественного контента |
| 🌐 **Мультиязычность** | Полная поддержка 🇷🇺 русского и 🇬🇧 английского языков |
| 🎨 **ASCII-Арт** | Автоматическая генерация визуальных элементов |
| 📁 **Экспорт** | Сохранение статей в Markdown, TXT и JSON форматах |
| 🔎 **Поиск** | Быстрый поиск по всем сохранённым статьям |
| 🎯 **Категории** | Автоматическая категоризация контента |
| ⌨️ **Hotkeys** | Удобные горячие клавиши для навигации |
| 🎨 **Темы** | Несколько визуальных тем оформления |

---

## 🖼️ Скриншоты

<div align="center">

### Главный экран
```
╔══════════════════════════════════════════════════════════╗
║                    📚 InfWIKI v1.0.0                     ║
║              Бесконечная Энциклопедия Знаний             ║
╠══════════════════════════════════════════════════════════╣
║  [1] 🔍 Поиск статьи                                     ║
║  [2] 📝 Создать новую статью                             ║
║  [3] 📂 Мои сохранённые статьи                           ║
║  [4] ⚙️  Настройки                                       ║
║  [5] ❌ Выход                                            ║
╚══════════════════════════════════════════════════════════╝
```

### Пример статьи
```
╔══════════════════════════════════════════════════════════╗
║              🌌 ЧЁРНЫЕ ДЫРЫ                              ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║     *                                                      ║
║    ***      ✦                                              ║
║   *****    *****     🌑                                    ║
║  *******  *******                                          ║
║   *****    *****                                           ║
║    ***      *                                              ║
║     *                                                      ║
║                                                          ║
║  Чёрная дыра — область пространства-времени...            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

</div>

---

## 🚀 Быстрый старт

### 📋 Требования

- Python 3.8 или выше
- API ключ Google Gemini
- pip (менеджер пакетов Python)

### 🔧 Установка

#### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/InfWIKI.git
cd InfWIKI
```

#### 2. Создание виртуального окружения

```bash
# Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

#### 3. Установка зависимостей

```bash
pip install -r requirements.txt
```

#### 4. Настройка API ключа

Создайте файл `.env` в корне проекта:

```bash
# .env
GEMINI_API_KEY=your_api_key_here
LANG=ru  # или 'en' для английского
```

> 💡 **Получить API ключ:** [Google AI Studio](https://makersuite.google.com/app/apikey)

### ▶️ Запуск

```bash
# Запуск основного приложения
python main.py

# Или через скрипт
./run.sh
```

---

## 🛠️ Технологии

<div align="center">

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)

</div>

### Основной стек

| Технология | Назначение |
|------------|------------|
| 🐍 **Python 3.8+** | Основной язык разработки |
| 💎 **Gemini API** | Генерация контента и ASCII-арта |
| 📦 **Rich** | Красивый вывод в терминале |
| 🔑 **Python-dotenv** | Управление переменными окружения |
| 📝 **Markdown** | Форматирование статей |
| 🔍 **Whoosh/Elastic** | Полнотекстовый поиск |

### Зависимости

```txt
google-generativeai>=0.3.0
rich>=13.0.0
python-dotenv>=1.0.0
click>=8.0.0
requests>=2.28.0
```

---

## 📁 Структура проекта

```
InfWIKI/
├── 📄 main.py              # Точка входа приложения
├── 📄 requirements.txt     # Зависимости Python
├── 📄 README.md           # Документация
├── 📄 LICENSE             # Лицензия проекта
├── 📄 .env.example        # Шаблон переменных окружения
│
├── 📂 src/
│   ├── 📂 core/
│   │   ├── __init__.py
│   │   ├── app.py         # Основная логика приложения
│   │   ├── config.py      # Конфигурация
│   │   └── exceptions.py  # Пользовательские исключения
│   │
│   ├── 📂 generators/
│   │   ├── __init__.py
│   │   ├── article.py     # Генерация статей
│   │   ├── ascii_art.py   # Генерация ASCII-арта
│   │   └── summarizer.py  # Создание резюме
│   │
│   ├── 📂 storage/
│   │   ├── __init__.py
│   │   ├── database.py    # Работа с БД
│   │   ├── exporter.py    # Экспорт статей
│   │   └── searcher.py    # Поиск по статьям
│   │
│   └── 📂 ui/
│       ├── __init__.py
│       ├── menu.py        # Меню навигации
│       ├── themes.py      # Темы оформления
│       └── hotkeys.py     # Горячие клавиши
│
├── 📂 data/
│   ├── 📂 articles/       # Сохранённые статьи
│   ├── 📂 cache/          # Кэш API запросов
│   └── 📂 templates/      # Шаблоны статей
│
├── 📂 tests/
│   ├── test_generators.py
│   ├── test_storage.py
│   └── test_ui.py
│
└── 📂 docs/
    ├── api.md            # API документация
    └── contributing.md   # Гайд для контрибьюторов
```

---

## ⚙️ Конфигурация

### Файл конфигурации `config.yaml`

```yaml
# Основная конфигурация
app:
  name: "InfWIKI"
  version: "1.0.0"
  default_language: "ru"
  
# Настройки Gemini API
gemini:
  model: "gemini-pro"
  temperature: 0.7
  max_tokens: 4096
  timeout: 30
  
# Настройки хранения
storage:
  articles_dir: "./data/articles"
  cache_dir: "./data/cache"
  auto_save: true
  
# Настройки UI
ui:
  theme: "default"
  show_ascii_art: true
  color_scheme: "dark"
  font_size: "medium"
  
# Логирование
logging:
  level: "INFO"
  file: "./logs/app.log"
  max_size: "10MB"
```

### Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `GEMINI_API_KEY` | Ключ API Google Gemini | *обязательно* |
| `LANG` | Язык интерфейса | `ru` |
| `DEBUG` | Режим отладки | `false` |
| `LOG_LEVEL` | Уровень логирования | `INFO` |

---

## 🎨 Доступные темы

InfWIKI поддерживает несколько визуальных тем для комфортной работы:

| Тема | Описание | Команда |
|------|----------|---------|
| 🌑 **Dark** | Тёмная тема (по умолчанию) | `--theme dark` |
| 🌞 **Light** | Светлая тема | `--theme light` |
| 🌊 **Ocean** | Синяя морская тема | `--theme ocean` |
| 🌲 **Forest** | Зелёная лесная тема | `--theme forest` |
| 🍇 **Grape** | Фиолетовая тема | `--theme grape` |
| 🔥 **Sunset** | Оранжевая закатная тема | `--theme sunset` |

### Смена темы

```bash
# Через CLI
python main.py --theme ocean

# Через настройки в приложении
[4] ⚙️ Настройки → Тема → Ocean
```

---

## ⌨️ Горячие клавиши

### Навигация

| Клавиша | Действие |
|---------|----------|
| `↑` `↓` | Перемещение по меню |
| `Enter` | Выбор пункта / Подтверждение |
| `Esc` | Назад / Отмена |
| `Q` | Выход из приложения |

### Работа со статьями

| Клавиша | Действие |
|---------|----------|
| `N` | Новая статья |
| `S` | Поиск статьи |
| `L` | Список сохранённых |
| `E` | Экспорт статьи |
| `D` | Удалить статью |
| `R` | Обновить статью |

### Быстрые команды

| Комбинация | Действие |
|------------|----------|
| `Ctrl + S` | Быстрое сохранение |
| `Ctrl + F` | Поиск по тексту |
| `Ctrl + R` | Перезагрузка |
| `Ctrl + H` | Показать справку |

---

## 📚 Использование

### Создание статьи

```bash
# Через CLI
python main.py create --topic "Квантовая физика" --lang ru

# Через Python API
from infwiki import InfWIKI

app = InfWIKI(api_key="your_key")
article = app.generate_article("Теория относительности", language="ru")
print(article.content)
```

### Поиск статей

```bash
# Поиск по названию
python main.py search "космос"

# Поиск с фильтром
python main.py search --query "физика" --category "наука" --lang ru
```

### Экспорт статей

```bash
# Экспорт в Markdown
python main.py export --id 123 --format md

# Экспорт всех статей
python main.py export --all --format json --output ./backup
```

---

## 🗺️ Roadmap

<div align="center">

```
2024 Q1 ✅          2024 Q2 🔄          2024 Q3 📅          2024 Q4 📅
├─ Базовая версия   ├─ Веб-интерфейс    ├─ Мобильное приложение
├─ Gemini API       ├─ Синхронизация    ├─ Офлайн режим
├─ RU/EN языки      ├─ Теги и категории ├─ Голосовой ввод
└─ ASCII-арт        └─ Экспорт PDF      └─ Плагины
```

</div>

### Планируемые функции

- [ ] 🌐 **Веб-интерфейс** — Доступ через браузер
- [ ] 📱 **Мобильное приложение** — iOS и Android версии
- [ ] 🔔 **Уведомления** — О новых статьях по интересам
- [ ] 👥 **Мультипользовательский режим** — Синхронизация между устройствами
- [ ] 📊 **Статистика** — Аналитика чтения и интересов
- [ ] 🔌 **Плагины** — Расширяемость функционала
- [ ] 📄 **PDF экспорт** — Печать и публикация
- [ ] 🎙️ **Голосовой ввод** — Поиск голосом

---

## 🤝 Contributing

Мы приветствуем вклад в развитие проекта! 

### Как внести свой вклад

1. **Форкните репозиторий**
   ```bash
   git fork https://github.com/yourusername/InfWIKI
   ```

2. **Создайте ветку**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Внесите изменения**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

4. **Отправьте изменения**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Создайте Pull Request**

### Стандарты кода

- 📝 Используйте **docstrings** для всех функций
- 🧪 Пишите **тесты** для нового функционала
- 📋 Следуйте **PEP 8** для Python кода
- 🔤 Коммиты на английском языке

### Типы контрибьюций

| Тип | Описание |
|-----|----------|
| 🐛 **Bug Reports** | Сообщения об ошибках |
| 💡 **Feature Requests** | Предложения новых функций |
| 📝 **Documentation** | Улучшение документации |
| 🔧 **Code** | Исправления и новый функционал |
| 🎨 **Design** | Улучшение UI/UX |
| 🌍 **Translation** | Перевод на другие языки |

---

## 📄 License

Этот проект распространяется под лицензией **MIT License**.

```
MIT License

Copyright (c) 2024 InfWIKI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 📞 Контакты

<div align="center">

### Разработчик

| 📧 Email | 💬 Telegram | 🐙 GitHub |
|----------|-------------|-----------|
| [your.email@example.com](mailto:your.email@example.com) | [@yourusername](https://t.me/yourusername) | [@yourusername](https://github.com/yourusername) |

### Сообщество

[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/yourserver)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/yourchannel)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/yourusername)

</div>

---

## 🙏 Благодарности

- 🌟 **Google** — за потрясающий Gemini API
- 💎 **Rich Library** — за красивый вывод в терминале
- 👨‍💻 **Всем контрибьюторам** — за вашу помощь и поддержку

---

<div align="center">

### ⭐ Если вам понравился проект, поставьте звезду!

**InfWIKI** © 2024 | Сделано с ❤️ для любителей знаний

```
   _____ _______ _____  ______ _____  
  / ____|__   __|  __ \|  ____|  __ \ 
 | (___    | |  | |__) | |__  | |__) |
  \___ \   | |  |  ___/|  __| |  _  / 
  ____) |  | |  | |    | |____| | \ \ 
 |_____/   |_|  |_|    |______|_|  \_\
                                      
```

</div>
