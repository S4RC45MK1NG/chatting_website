

document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('loginForm');
	const msg = document.getElementById('loginMessage');
	const card = document.getElementById('loginCard');

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		const username = document.getElementById('username').value.trim();
		const room_code = document.getElementById('room_code').value;

		let date = Date.UTC();
		alert(date.getMinutes())
		// document.cookie = `chat-user="${username}, expires="`

		if (!username || !room_code) {
			msg.textContent = 'Please enter both username and room code.';
			msg.style.color = '#b91c1c';
			return;
		}
        

		// Simple client-side placeholder check. Replace with real auth.
		msg.style.color = '#065f46';
		msg.textContent = 'Joining Room...';

		// Save user data to sessionStorage so chat page can read it
		sessionStorage.setItem('username', username);
		sessionStorage.setItem('room_code', room_code);

		setTimeout(() => {
			msg.textContent = `Welcome, ${username}!`;
		}, 700);
		setTimeout(() => {
			// Redirect to local chat page
			window.location.href = `https://sigamboi.hackclub.app/${room_code}`;
		}, 1000);
	});
});
