// Модуль работы с localStorage (эмуляция БД)

const STORAGE_KEYS = {
    USERS: 'room_booking_users',
    ROOMS: 'room_booking_rooms',
    BOOKINGS: 'room_booking_bookings'
};

// Инициализация демо-данных
function initDemoData() {
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
        const demoRooms = [
            { id: 1, name: 'Переговорная 304', capacity: 12, hasProjector: true, hasWhiteboard: true },
            { id: 2, name: 'Конференц-зал A', capacity: 30, hasProjector: true, hasWhiteboard: false },
            { id: 3, name: 'Комната для совещаний', capacity: 6, hasProjector: false, hasWhiteboard: true }
        ];
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(demoRooms));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const demoUsers = [
            { id: 1, email: 'user@example.com', password: '123', fullName: 'Иван Петров', role: 'user' },
            { id: 2, email: 'admin@example.com', password: 'admin', fullName: 'Администратор', role: 'admin' }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
    }
}

function getRooms() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
}

function getBookings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
}

function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

function saveBooking(booking) {
    const bookings = getBookings();
    booking.id = Date.now();
    bookings.push(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return booking;
}

function cancelBooking(id) {
    let bookings = getBookings();
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

function isSlotAvailable(roomId, date, startTime, endTime) {
    const bookings = getBookings();
    return !bookings.some(b => 
        b.roomId === roomId && 
        b.date === date && 
        ((startTime >= b.startTime && startTime < b.endTime) ||
         (endTime > b.startTime && endTime <= b.endTime) ||
         (startTime <= b.startTime && endTime >= b.endTime))
    );
}
