// Основная логика приложения

let currentRoomId = null;

document.addEventListener('DOMContentLoaded', () => {
    initDemoData();
    
    const user = checkAuth();
    if (user) {
        showMainContent();
        loadRooms();
        loadMyBookings();
    } else {
        showAuthForm();
    }
    
    document.getElementById('loginBtn')?.addEventListener('click', handleLogin);
    document.getElementById('registerBtn')?.addEventListener('click', handleRegister);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('showRegister')?.addEventListener('click', showRegisterForm);
    document.getElementById('showLogin')?.addEventListener('click', showLoginForm);
    document.getElementById('saveBookingBtn')?.addEventListener('click', handleCreateBooking);
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
});

function showAuthForm() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('mainSection').style.display = 'none';
    showLoginForm();
}

function showMainContent() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainSection').style.display = 'block';
    const user = checkAuth();
    document.getElementById('userName').textContent = user?.fullName || 'Гость';
    
    if (user?.role === 'admin') {
        document.getElementById('adminPanel').style.display = 'block';
    }
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = login(email, password);
    if (result.success) {
        showMainContent();
        loadRooms();
        loadMyBookings();
    } else {
        alert(result.error);
    }
}

function handleRegister() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const fullName = document.getElementById('regFullName').value;
    
    const result = register(email, password, fullName);
    if (result.success) {
        showMainContent();
        loadRooms();
    } else {
        alert(result.error);
    }
}

function handleLogout() {
    logout();
    showAuthForm();
}

function loadRooms() {
    const rooms = fetchRooms();
    const container = document.getElementById('roomsList');
    container.innerHTML = rooms.map(room => `
        <div class="room-card">
            <h3>${room.name}</h3>
            <p>👥 Вместимость: ${room.capacity} чел.</p>
            <p>📽️ Проектор: ${room.hasProjector ? '✅' : '❌'}</p>
            <p>📝 Доска: ${room.hasWhiteboard ? '✅' : '❌'}</p>
            <button class="btn" onclick="showBookingForRoom(${room.id})">📅 Забронировать</button>
        </div>
    `).join('');
}

function loadMyBookings() {
    const bookings = fetchMyBookings();
    const container = document.getElementById('myBookingsList');
    const rooms = fetchRooms();
    
    if (bookings.length === 0) {
        container.innerHTML = '<p>📭 У вас пока нет бронирований</p>';
        return;
    }
    
    container.innerHTML = bookings.map(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        return `
            <div class="booking-card">
                <h3>${room?.name || 'Помещение'}</h3>
                <p>📅 Дата: ${booking.date}</p>
                <p>⏰ Время: ${booking.startTime} - ${booking.endTime}</p>
                <p>🎯 Цель: ${booking.purpose}</p>
                <button class="btn btn-danger" onclick="cancelBookingHandler(${booking.id})">❌ Отменить</button>
            </div>
        `;
    }).join('');
}

function showBookingForRoom(roomId) {
    currentRoomId = roomId;
    document.getElementById('bookingModal').classList.add('active');
}

function closeModal() {
    document.getElementById('bookingModal').classList.remove('active');
    currentRoomId = null;
}

function handleCreateBooking() {
    const date = document.getElementById('bookingDate').value;
    const startTime = document.getElementById('bookingStart').value;
    const endTime = document.getElementById('bookingEnd').value;
    const purpose = document.getElementById('bookingPurpose').value;
    
    if (!date || !startTime || !endTime || !purpose) {
        alert('Заполните все поля');
        return;
    }
    
    if (!currentRoomId) {
        alert('Выберите помещение');
        return;
    }
    
    const result = createBooking(currentRoomId, date, startTime, endTime, purpose);
    if (result.success) {
        closeModal();
        loadRooms();
        loadMyBookings();
        alert('✅ Бронирование создано!');
    } else {
        alert(result.error);
    }
}

function cancelBookingHandler(id) {
    if (confirm('Отменить бронирование?')) {
        cancelBooking(id);
        loadMyBookings();
        alert('❌ Бронирование отменено');
    }
}

window.showBookingForRoom = showBookingForRoom;
window.cancelBookingHandler = cancelBookingHandler;
