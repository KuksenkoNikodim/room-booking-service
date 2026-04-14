from flask_sqlalchemy import SQLAlchemy  # Импортируем SQLAlchemy для работы с БД
from datetime import datetime            # Импортируем datetime для работы с датой

db = SQLAlchemy()  # Создаем объект базы данных

# Модель для таблицы "комнаты"
class Room(db.Model):
    __tablename__ = 'rooms'  # Название таблицы в БД (ДВА подчеркивания)
    
    id = db.Column(db.Integer, primary_key=True)           # ID комнаты (главный ключ)
    name = db.Column(db.String(100), nullable=False)       # Название комнаты
    capacity = db.Column(db.Integer, nullable=False)       # Вместимость
    equipment = db.Column(db.String(200))                  # Оборудование
    
    # Связь с бронированиями (одна комната - много броней)
    bookings = db.relationship('Booking', backref='room', lazy=True)

# Модель для таблицы "бронирования"
class Booking(db.Model):
    __tablename__ = 'bookings'  # Название таблицы в БД (ДВА подчеркивания)
    
    id = db.Column(db.Integer, primary_key=True)                     # ID брони
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)  # Связь с комнатой
    user_name = db.Column(db.String(100), nullable=False)            # Имя пользователя
    date = db.Column(db.Date, nullable=False)                        # Дата брони
    start_time = db.Column(db.String(5), nullable=False)             # Время начала (HH:MM)
    end_time = db.Column(db.String(5), nullable=False)               # Время окончания (HH:MM)
    purpose = db.Column(db.String(200))                              # Назначение
    created_at = db.Column(db.DateTime, default=datetime.utcnow)     # Дата создания записи