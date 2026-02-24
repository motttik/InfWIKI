# Руководство для контрибьюторов InfWIKI

Благодарим за интерес к проекту InfWIKI! 🎉

## 📋 Содержание

- [Как внести вклад](#как-внести-вклад)
- [Стандарты кода](#стандарты-кода)
- [Процесс разработки](#процесс-разработки)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Сообщество](#сообщество)

## 🚀 Как внести вклад

### 1. Сообщить о баге

- Проверьте существующие [Issues](https://github.com/motttik/InfWIKI/issues)
- Создайте новый issue с шаблоном "Bug Report"
- Приложите скриншоты, логи, шаги воспроизведения

### 2. Предложить функцию

- Обсудите идею в Issues перед реализацией
- Используйте шаблон "Feature Request"
- Опишите use-case и преимущества

### 3. Написать код

```bash
# Форкните репозиторий
git fork https://github.com/motttik/InfWIKI

# Клонируйте локально
git clone git@github.com:your-username/InfWIKI.git

# Создайте ветку
git checkout -b feature/your-feature-name

# Внесите изменения и закоммитьте
git add .
git commit -m "feat: добавить новую функцию"

# Отправьте и создайте PR
git push origin feature/your-feature-name
```

## 📝 Стандарты кода

### TypeScript

```typescript
// ✅ Хорошо
interface User {
  id: string
  name: string
  email: string
}

const getUser = async (id: string): Promise<User> => {
  // implementation
}

// ❌ Избегайте
const getUser = (id) => {
  // no types, no async
}
```

### Компоненты React

```tsx
// ✅ Хорошо
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  return <button className={`btn-${variant}`}>{children}</button>
}
```

### Коммиты

Используем [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` новая функция
- `fix:` исправление бага
- `docs:` документация
- `style:` форматирование
- `refactor:` рефакторинг
- `test:` тесты
- `chore:` конфигурация

```bash
git commit -m "feat: добавить тёмную тему"
git commit -m "fix: исправить ошибку в SearchBar"
git commit -m "docs: обновить README"
```

## 🔄 Процесс разработки

### 1. Setup

```bash
npm install
npm run dev
```

### 2. Запуск тестов

```bash
npm run test
npm run test:coverage
```

### 3. Линтинг

```bash
npm run lint
npm run lint:fix
```

### 4. Проверка типов

```bash
npm run typecheck
```

## 📤 Pull Request Guidelines

### Чек-лист перед отправкой

- [ ] Код проходит линтинг (`npm run lint`)
- [ ] Все тесты проходят (`npm run test`)
- [ ] Проверены типы TypeScript (`npm run typecheck`)
- [ ] Добавлены тесты для новых функций
- [ ] Обновлена документация
- [ ] Коммиты следуют Conventional Commits

### Описание PR

```markdown
## Описание
Краткое описание изменений

## Тип изменений
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📝 Documentation
- [ ] ♻️ Refactoring
- [ ] ⚡ Performance
- [ ] 🧪 Tests

## Чек-лист
- [ ] Я прочитал CONTRIBUTING.md
- [ ] Мой код проходит линтинг
- [ ] Я добавил тесты
- [ ] Все тесты проходят
- [ ] Я обновил документацию

## Скриншоты (если применимо)
<!-- Добавьте скриншоты интерфейса -->

## Related Issues
Closes #123
```

## 🌟 Сообщество

### Кодекс поведения

- Будьте уважительны и доброжелательны
- Помогайте новичкам
- Конструктивная критика приветствуется
- Фокусируйтесь на том, что лучше для сообщества

### Контакты

- GitHub Issues: [motttik/InfWIKI/issues](https://github.com/motttik/InfWIKI/issues)
- Email: ваш-email@example.com
- Telegram: @your-username

## 📜 Лицензия

Проект распространяется под лицензией [MIT](LICENSE).

---

**Спасибо за ваш вклад! 🙏**

Каждый PR делает InfWIKI лучше для всех пользователей.
