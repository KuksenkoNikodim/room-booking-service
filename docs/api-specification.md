# API Specification — Room Booking Service

## Базовый URL
http://localhost:8000/api

## Аутентификация

### POST /auth/login
Вход в систему

**Запрос:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
Ответ (200 OK):
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Иван Петров",
    "role": "user"
  }
}
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Иван Петров"
}
Ответ (201 Created):
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Иван Петров",
Помещения (Rooms)
GET /rooms
Получить список всех помещений

Параметры фильтрации:

capacity — минимальная вместимость

projector — наличие проектора (true/false)

whiteboard — наличие доски (true/false)

Ответ (200 OK):
[
  {
    "id": 1,
    "name": "Переговорная 304",
    "capacity": 12,
    "hasProjector": true,
    "hasWhiteboard": true,
    "description": "Комната с видом на город"
  }
]
POST /rooms (только admin)
{
  "name": "Конференц-зал A",
  "capacity": 30,
  "hasProjector": true,
  "hasWhiteboard": false,
  "description": "Большой зал для конференций"
}
Бронирования (Bookings)
GET /bookings/my
Получить список своих бронирований

Ответ (200 OK):
[
  {
    "id": 128,
    "roomId": 3,
    "roomName": "Переговорная 304",
    "date": "2024-12-25",
    "startTime": "14:00:00",
    "endTime": "15:30:00",
    "purpose": "Еженедельное совещание",
    "status": "active"
  }
]
POST /bookings
Создать новое бронирование

Запрос:
{
  "roomId": 3,
  "date": "2024-12-25",
  "startTime": "14:00",
  "endTime": "15:30",
  "purpose": "Еженедельное совещание отдела разработки"
}
Ответ (201 Created):
{
  "id": 128,
  "userId": 42,
  "roomId": 3,
  "date": "2024-12-25",
  "startTime": "14:00:00",
  "endTime": "15:30:00",
  "purpose": "Еженедельное совещание отдела разработки",
  "status": "active",
  "createdAt": "2024-12-01T10:30:00Z",
  "room": {
    "id": 3,
    "name": "Переговорная 304",
    "capacity": 12
  }
}
Ошибка (409 Conflict):
{
  "error": "ROOM_ALREADY_BOOKED",
  "message": "Помещение уже забронировано на выбранное время",
  "conflictingBooking": {
    "id": 125,
    "startTime": "14:00",
    "endTime": "15:00"
  }
}
DELETE /bookings/{id}
Отменить бронирование

Ответ (200 OK):
{
  "success": true
}
GET /bookings/availability
Проверить доступность слота

Параметры:

roomId — ID помещения

date — дата (YYYY-MM-DD)

startTime — время начала (HH:MM)

endTime — время окончания (HH:MM)

Ответ (200 OK):
{
  "available": true,
  "message": "Слот свободен"
}

    "role": "user"
  }
}
