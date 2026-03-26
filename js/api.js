// Эмуляция API

let currentUser = null;

function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = { ...user };
        delete currentUser.password;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    }
    return { success: false, error: 'Неверный email или пароль' };
}

function register(email, password, fullName) {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return { success: false, error: 'Пользователь уже существует' };
    }
    const newUser = {
        id: Date.now(),
        email,
        password,
        fullName,
        role: 'user'
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return login(email, password);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    return { success: true };
}

function checkAuth() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
        currentUser = JSON.parse(saved);
        return currentUser;
    }
    return null;
}

function fetchRooms() {
    return getRooms();
}

function fetchMyBookings() {
    if (!currentUser) return [];
    const bookings = getBookings();
    return bookings.filter(b => b.userId === currentUser.id);
}

function createBooking(roomId, date, startTime, endTime, purpose) {
    if (!currentUser) {
        return { success: false, error: 'Необходима авторизация' };
    }
    
    if (!isSlotAvailable(roomId, date, startTime, endTime)) {
        return { success: false, error: 'Время уже занято' };
    }
    
    const booking = {
        userId: currentUser.id,
        roomId,
        date,
        startTime,
        endTime,
        purpose,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    const saved = saveBooking(booking);
    return { success: true, booking: saved };
}
