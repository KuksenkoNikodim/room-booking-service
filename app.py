from flask import Flask, render_template, request, redirect, url_for, flash
from database import db, Room, Booking
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'room_booking_secret_key_2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    
    # Добавляем тестовые комнаты, если их нет
    if Room.query.count() == 0:
        test_rooms = [
            Room(name="Переговорная А", capacity=10, equipment="Проектор, доска, Wi-Fi"),
            Room(name="Конференц-зал", capacity=50, equipment="Экран, звук, микрофоны"),
            Room(name="Комната для презентаций", capacity=20, equipment="Проектор, экран"),
            Room(name="Малая переговорная", capacity=6, equipment="Доска, маркеры"),
            Room(name="VIP комната", capacity=15, equipment="Плазма, конференц-связь")
        ]
        for room in test_rooms:
            db.session.add(room)
        db.session.commit()

@app.route('/')
def index():
    rooms = Room.query.all()
    bookings = Booking.query.order_by(Booking.date, Booking.start_time).all()
    return render_template('index.html', rooms=rooms, bookings=bookings)

@app.route('/booking/<int:room_id>', methods=['GET', 'POST'])
def booking(room_id):
    room = Room.query.get_or_404(room_id)
    
    if request.method == 'POST':
        # Проверка на конфликт бронирования
        existing_booking = Booking.query.filter(
            Booking.room_id == room_id,
            Booking.date == datetime.strptime(request.form['date'], '%Y-%m-%d').date(),
            Booking.start_time < request.form['end_time'],
            Booking.end_time > request.form['start_time']
        ).first()
        
        if existing_booking:
            flash('Это время уже занято! Выберите другое время.', 'danger')
        else:
            new_booking = Booking(
                room_id=room_id,
                user_name=request.form['user_name'],
                date=datetime.strptime(request.form['date'], '%Y-%m-%d').date(),
                start_time=request.form['start_time'],
                end_time=request.form['end_time'],
                purpose=request.form['purpose']
            )
            db.session.add(new_booking)
            db.session.commit()
            flash('Бронирование успешно создано!', 'success')
            return redirect(url_for('my_bookings'))
    
    return render_template('booking.html', room=room)

@app.route('/my-bookings')
def my_bookings():
    bookings = Booking.query.order_by(Booking.date.desc(), Booking.start_time).all()
    return render_template('my_bookings.html', bookings=bookings)

@app.route('/cancel-booking/<int:booking_id>')
def cancel_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    db.session.delete(booking)
    db.session.commit()
    flash('Бронирование отменено', 'success')
    return redirect(url_for('my_bookings'))

@app.route('/admin')
def admin():
    rooms = Room.query.all()
    bookings = Booking.query.all()
    
    total_rooms = len(rooms)
    total_bookings = len(bookings)
    
    return render_template('admin.html', 
                         rooms=rooms, 
                         bookings=bookings, 
                         total_rooms=total_rooms,
                         total_bookings=total_bookings)

@app.route('/admin/add-room', methods=['POST'])
def add_room():
    room = Room(
        name=request.form['name'],
        capacity=int(request.form['capacity']),
        equipment=request.form['equipment']
    )
    db.session.add(room)
    db.session.commit()
    flash('Комната добавлена', 'success')
    return redirect(url_for('admin'))

@app.route('/admin/delete-room/<int:room_id>')
def delete_room(room_id):
    room = Room.query.get_or_404(room_id)
    db.session.delete(room)
    db.session.commit()
    flash('Комната удалена', 'success')
    return redirect(url_for('admin'))

if __name__ == '__main__':
    app.run(debug=True)