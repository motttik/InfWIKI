# 🦙 Ollama Setup Guide

**Авто-определение провайдера**: ✅ Включено  
**Fallback цепочка**: Gemini → Ollama → Demo Mode

---

## 🚀 Быстрая настройка

### 1. Установить Ollama

```bash
# Linux
curl -fsSL https://ollama.com/install.sh | sh

# macOS
brew install ollama

# Windows
# Скачать с https://ollama.com/download
```

### 2. Запустить сервер

```bash
ollama serve
```

### 3. Установить модель

```bash
# Рекомендуемые модели для InfWIKI
ollama pull llama3.2:3b      # Быстрая, 2GB
ollama pull mistral:7b       # Сбалансированная, 4GB
ollama pull qwen2.5:7b       # Хорошая для русского языка
```

### 4. Настроить InfWIKI

```bash
# Скопировать .env
cp .env.example .env

# Редактировать .env
nano .env
```

---

## 📝 Конфигурация .env

```bash
# Gemini API (опционально)
GEMINI_API_KEY=your_api_key_here

# Ollama Configuration
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama3.2:3b

# Режим разработки
VITE_APP_MODE=development
```

---

## 🔄 Логика авто-определения

```
┌─────────────────────────────────┐
│  Запуск приложения              │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Есть GEMINI_API_KEY?           │
│  (валидный, не заглушка)        │
└──────┬──────────────┬───────────┘
       │ ДА           │ НЕТ
       │              │
       ▼              ▼
┌─────────────┐  ┌────────────────────┐
│ ✨ Gemini   │  │ Проверка Ollama    │
│ Provider    │  │ (GET /api/tags)    │
└─────────────┘  └─────┬──────┬───────┘
                       │      │
                  ДА   │      │ НЕТ
                       │      │
                       ▼      ▼
                ┌──────────┐ ┌──────────┐
                │ 🦙 Ollama│ │ 🎭 Demo  │
                │ Provider │ │ Mode     │
                └──────────┘ └──────────┘
```

---

## 🧪 Проверка работы

### 1. Проверка Ollama

```bash
# Проверить доступность
curl http://localhost:11434/api/tags

# Ожидаемый ответ:
# {"models":[{"name":"llama3.2:3b",...}]}
```

### 2. Запуск InfWIKI

```bash
npm run dev
```

### 3. Проверка консоли

Откройте браузер → DevTools (F12) → Console

**Ожидаемые сообщения**:

```
⚠️  No Gemini API key, checking Ollama availability...
🦙 Ollama available at http://localhost:11434 (model: llama3.2:3b)
🔄 Auto-fallback to Ollama provider
```

Или если Ollama недоступен:

```
⚠️  No Gemini API key, checking Ollama availability...
⚠️  Ollama not available, falling back to Demo Mode
🎭 Running in Demo Mode (no API providers available)
```

---

## 🔧 Troubleshooting

### Проблема: Ollama не доступен

**Симптомы**:
```
Failed to fetch
ECONNREFUSED
```

**Решение**:
```bash
# 1. Проверить запущен ли сервер
ps aux | grep ollama

# 2. Запустить сервер
ollama serve

# 3. Проверить порт
lsof -i :11434
```

---

### Проблема: Модель не найдена

**Симптомы**:
```
model "llama3.2:3b" not found
404 Not Found
```

**Решение**:
```bash
# Установить модель
ollama pull llama3.2:3b

# Или изменить модель в .env
VITE_OLLAMA_MODEL=mistral:7b
```

---

### Проблема: Медленная генерация

**Симптомы**:
- Контент генерируется > 10 секунд
- CPU загрузка 100%

**Решение**:
```bash
# Использовать модель меньше
ollama pull llama3.2:1b  # Очень быстрая, 1GB
# Изменить в .env
VITE_OLLAMA_MODEL=llama3.2:1b
```

Или использовать GPU:
```bash
# Ollama автоматически использует GPU если доступен
# Проверить:
ollama run llama3.2:3b "test"
```

---

## 📊 Сравнение провайдеров

| Провайдер | Скорость | Качество | Русский язык | Требования |
|-----------|----------|----------|--------------|------------|
| **Gemini** | ⚡⚡⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | API ключ |
| **Ollama (llama3.2:3b)** | ⚡⚡ | ⭐⭐⭐ | ⭐⭐ | 2GB RAM |
| **Ollama (mistral:7b)** | ⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 4GB RAM |
| **Ollama (qwen2.5:7b)** | ⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 4GB RAM |
| **Demo Mode** | ⚡⚡⚡ | ⭐ | ⭐⭐⭐ | Нет |

---

## 🔐 Безопасность

### Локальный запуск (рекомендуется)

```bash
# Ollama слушает только localhost
VITE_OLLAMA_BASE_URL=http://localhost:11434
```

### Сетевой доступ (только доверенная сеть)

```bash
# На стороне Ollama
OLLAMA_HOST=0.0.0.0:11434
ollama serve

# На стороне InfWIKI
VITE_OLLAMA_BASE_URL=http://192.168.1.100:11434
```

---

## 🎯 Production конфигурация

### Docker Compose

```yaml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  infwiki:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_OLLAMA_BASE_URL=http://ollama:11434
      - VITE_OLLAMA_MODEL=llama3.2:3b
    depends_on:
      - ollama

volumes:
  ollama_data:
```

---

## 📚 Дополнительные ресурсы

- **Ollama Docs**: https://ollama.com/docs
- **Модели**: https://ollama.com/library
- **GitHub**: https://github.com/ollama/ollama

---

**Версия**: 1.0  
**Дата**: 2026-03-23  
**Статус**: ✅ Ready
