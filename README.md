# Chat App (тестовое)

## 1) Что нужно установить

- [Node.js LTS](https://nodejs.org/) (после установки проверь в терминале: `node -v`, `npm -v`)
- [PostgreSQL](https://www.postgresql.org/download/) (запомни логин/пароль, который задашь при установке)
- (Опционально) [Git](https://git-scm.com/downloads), если хочешь клонировать проект

## 2) Скачай проект и открой папку

- Папка проекта должна быть `D:\chat`
- Внутри есть 2 части:
  - `server` - backend
  - `client` - frontend

## 3) Настрой базу данных PostgreSQL

Создай базу, например `chatBD`.

Если удобно через pgAdmin:
- Открой pgAdmin
- Databases -> Create -> Database
- Имя: `chatBD`

## 4) Создай `.env` файлы

### `server/.env`

```env
DB=postgres://YOUR_USER:YOUR_PASSWORD@localhost:5432/chatBD
PORT=3000
SECRET_ACCESS_TOKEN=SECRET_ACCESS_TOKEN
SECRET_REFRESH_TOKEN=SECRET_REFRESH_TOKEN
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:3000/api
```

## 5) Установи зависимости

Открой 2 терминала.

### Терминал 1 (backend)

```bash
cd D:\chat\server
npm install
```

### Терминал 2 (frontend)

```bash
cd D:\chat\client
npm install
```

## 6) Примени миграции БД

В терминале backend:

```bash
cd D:\chat\server
npx sequelize-cli db:migrate
```

Если хочешь полностью пересоздать БД с нуля (ОСТОРОЖНО: удалит данные):

```bash
npm run db
```

## 7) Запусти проект

### Backend

```bash
cd D:\chat\server
npm run dev
```

Должно быть: `Server is running on port 3000`

### Frontend

```bash
cd D:\chat\client
npm run dev
```

Открой в браузере URL из терминала Vite (обычно `http://localhost:5173`).

## 8) Как проверить

1. Открой `http://localhost:5173/auth`
2. Зарегистрируй 2 пользователей
3. Войди под первым
4. Выбери второго слева и отправь сообщение
5. Открой второй браузер/инкогнито, войди под вторым и проверь realtime чат

## 9) Если что-то не работает

- Проверь, что backend запущен на `3000`, frontend на `5173`
- Проверь `server/.env` и `client/.env`
- Перезапусти оба сервера после изменения `.env`
- Проверь, что PostgreSQL запущен и база `chatBD` существует

