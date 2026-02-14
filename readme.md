# Notice

![License](https://img.shields.io/badge/license-UNLICENSED-blue.svg)

Система управления задачами и проектами. Позволяет создавать проекты, организовывать задачи в списки, добавлять подзадачи и комментарии. Включает аутентификацию пользователей и интеграцию с Яндекс.Диском.

## Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.7-764ABC?style=flat-square&logo=redux)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Sass](https://img.shields.io/badge/Sass-1.85-CC6699?style=flat-square&logo=sass)

### Backend
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-6.5-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens)
![Passport](https://img.shields.io/badge/Passport-0.7-34E27A?style=flat-square&logo=passport)

### Testing
![Vitest](https://img.shields.io/badge/Vitest-3.1-6E9F18?style=flat-square&logo=vitest)
![Jest](https://img.shields.io/badge/Jest-29-C21325?style=flat-square&logo=jest)

## Features

- JWT аутентификация пользователей
- Создание и управление проектами
- Списки задач (tasklists)
- Задачи с приоритетами и статусами
- Подзадачи для детализации работы
- Комментарии к задачам
- Интеграция с Яндекс.Диском для хранения файлов

## Getting Started

Для запуска проекта см. инструкции в директориях:
- [client/README.md](./client/README.md) — запуск фронтенда
- [server/README.md](./server/README.md) — запуск бэкенда

## Project Structure

```
notice/
├── client/          # Next.js frontend
│   ├── src/
│   │   ├── app/     # App Router
│   │   ├── Components/
│   │   ├── store/   # Redux store
│   │   └── api/     # API calls
│   └── README.md
├── server/          # NestJS backend
│   ├── src/
│   │   ├── auth/    # Authentication
│   │   ├── task/    # Tasks module
│   │   ├── project/ # Projects module
│   │   └── prisma/  # Database schema
│   └── README.md
└── readme.md
```
