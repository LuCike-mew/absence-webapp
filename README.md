# MiraiBot WebApp — клиентская часть (Telegram Mini App)

Фронтенд для Telegram-бота **MiraiBot**, реализованный в виде **Telegram Mini App**
на React (Vite) и развёрнутый на **GitHub Pages**.

## Технологии

- **React 18** — компонентный UI
- **Vite** — быстрая сборка
- **Plain CSS** — стили с переменными темы Telegram

## Как это устроено

```text
MiraiBot (Python) ──► gzip + base64 ──► URL (?week=...&h=...) ──► index.html (GitHub Pages)
                                                                       │
MiraiBot (SQLite) ◄── Telegram.WebApp.sendData() ◄─── выбор студента  ┘
```

1. **Бэкенд** парсит расписание, замены и историю пропусков.
2. Данные сжимаются **gzip** → **base64** → URL-параметры.
3. **Mini App** распаковывает данные в браузере, отрисовывает интерфейс
   и возвращает выбор студента через `Telegram.WebApp.sendData()`.

## Структура проекта

```text
absence-webapp/
├── index.html           # Точка входа Vite (загружает Telegram SDK)
├── package.json
├── vite.config.js       # base: '/absence-webapp/' для GitHub Pages
├── src/
│   ├── main.jsx         # Рендер <App/>
│   ├── App.jsx          # Корневой компонент + инициализация данных
│   ├── App.css          # Все стили (портированы из оригинального index.html)
│   ├── context/
│   │   └── AppContext.jsx    # Глобальное состояние (табы, выбранные пары, удаление)
│   ├── hooks/
│   │   └── useTelegram.js    # Обёртка над window.Telegram.WebApp
│   ├── utils/
│   │   └── decompress.js     # Распаковка gzip + base64 + парсинг URL-параметров
│   └── components/
│       ├── NavTabs.jsx        # Переключение «Расписание» / «История»
│       ├── ViewModeBanner.jsx # Баннер «режим просмотра»
│       ├── ScheduleTab.jsx    # Вкладка расписания
│       ├── WeekPicker.jsx     # Навигация по неделям (← →)
│       ├── DayPill.jsx        # Кнопка дня недели
│       ├── PairCard.jsx       # Карточка пары (выбор / замена)
│       ├── HistoryTab.jsx     # Вкладка истории пропусков
│       ├── FilterBox.jsx      # Фильтр по дате
│       ├── HistoryDayCard.jsx # Карточка дня с пропусками
│       ├── BottomBar.jsx      # Кнопка «Сохранить пропуски»
│       ├── DeleteBar.jsx      # Панель массового удаления
│       └── Toast.jsx          # Всплывающее уведомление
└── dist/                # Собранные файлы (после npm run build)
```

## Разработка

```bash
npm install        # Установка зависимостей
npm run dev        # Запуск dev-сервера (http://localhost:5173)
npm run build      # Production-сборка в dist/
npm run preview    # Превью production-сборки
```

## Деплой на GitHub Pages

После сборки содержимое папки `dist/` должно быть развёрнуто как корень
GitHub Pages-репозитория:

1. `npm run build`
2. Скопировать содержимое `dist/` в корень репозитория
3. Закоммитить и запушить

Либо настроить GitHub Actions для автоматической сборки и деплоя
(рекомендуется — см. документацию Vite + GitHub Pages).

---

Проект создан с помощью ИИ-агента.