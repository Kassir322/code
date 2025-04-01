# Интернет-магазин учебной литературы

Проект бэкенда для интернет-магазина учебной литературы, разработанный на Node.js с использованием Express, Sequelize и PostgreSQL.

## Стек технологий

- **Backend**: Node.js, Express.js, Sequelize ORM, PostgreSQL
- **Аутентификация**: JWT (JSON Web Tokens)
- **Безопасность**: bcrypt для хеширования паролей, Helmet для HTTP-заголовков
- **Валидация**: Встроенные валидаторы Sequelize

## Структура проекта

```
study-cards-shop/
│
├── app.js                   # Точка входа в приложение
│
├── config/                  # Конфигурационные файлы
│   └── database.js          # Настройки подключения к базе данных
│
├── controllers/             # Контроллеры приложения
│   └── UserController.js    # Контроллер для работы с пользователями
│
├── db/                      # Инициализация и настройка базы данных
│   └── index.js             # Файл инициализации соединения с БД и моделей
│
├── middlewares/             # Промежуточное ПО (middleware)
│   └── authMiddleware.js    # Middleware для аутентификации
│
├── migrations/              # Миграции базы данных
│   └── 20240329000000-create-tables.js  # Миграция для создания всех таблиц
│
├── models/                  # Модели приложения
│   ├── User.js              # Модель пользователя
│   ├── Category.js          # Модель категории
│   ├── StudyCard.js         # Модель учебной карточки
│   ├── Order.js             # Модель заказа
│   ├── OrderItem.js         # Модель элемента заказа
│   └── Review.js            # Модель отзыва
│
├── routes/                  # Маршруты API
│   ├── index.js             # Основной файл маршрутов
│   └── userRoutes.js        # Маршруты для работы с пользователями
│
├── package.json             # Зависимости и скрипты npm
├── .env.example             # Пример файла с переменными окружения
└── README.md                # Описание проекта
```

## Установка и запуск

### Требования

- Node.js (версия 14.x или выше)
- PostgreSQL (версия 12.x или выше)

### Шаги установки

1. Клонировать репозиторий:

   ```bash
   git clone https://github.com/your-username/study-cards-shop.git
   cd study-cards-shop
   ```

2. Установить зависимости:

   ```bash
   npm install
   ```

3. Создать файл `.env` на основе `.env.example` и настроить переменные окружения:

   ```bash
   cp .env.example .env
   # Отредактировать .env с вашими настройками
   ```

4. Создать базу данных PostgreSQL:

   ```bash
   createdb study_cards_shop
   ```

5. Запустить миграции для создания таблиц:

   ```bash
   npm run migrate
   ```

6. Запустить сервер:
   ```bash
   npm run dev
   ```

## API Endpoints

### Пользователи

- `POST /api/users/register` - Регистрация нового пользователя
- `POST /api/users/login` - Авторизация пользователя
- `GET /api/users/me` - Получение профиля текущего пользователя
- `GET /api/users/:id` - Получение пользователя по ID
- `PUT /api/users/:id` - Обновление данных пользователя
- `DELETE /api/users/:id` - Удаление пользователя
