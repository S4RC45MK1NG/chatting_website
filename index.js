
document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('loginForm');
	const msg = document.getElementById('loginMessage');
	const card = document.getElementById('loginCard');

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		const username = document.getElementById('username').value.trim();
		const password = document.getElementById('room_code').value;

		if (!username || !password) {
			msg.textContent = 'Please enter both username and password.';
			msg.style.color = '#b91c1c';
			return;
		}
        

		// Simple client-side placeholder check. Replace with real auth.
		msg.style.color = '#065f46';
		msg.textContent = 'Logging in...';

		setTimeout(() => {
			msg.textContent = `Welcome, ${username}!`;
			card.style.display = 'none';
		}, 700);
	});
});
