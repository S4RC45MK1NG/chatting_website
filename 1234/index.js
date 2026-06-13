const messageList = document.getElementById('messageList');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

function getuser_cookie() {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const [key, myuser] = cookie.trim().split('=');

        if (key === "chat-user") {
            return myuser;
        }
    }

    return null;
}

console.log(getuser_cookie());

function appendMessage(text, user) {
    const message = document.createElement('article');
    message.className = 'message ' + user;
    const userLabel;

    message.innerHTML = `
    <strong>${userLabel}</strong>
    <p>${text}</p>
    <small>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
    `;

    messageList.appendChild(message);
    messageList.scrollTop = messageList.scrollHeight;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    chatInput.value = '';
    sendButton.disabled = true;
    setTimeout(() => {
    appendMessage(`I heard: ${text}`, 'assistant');
    sendButton.disabled = false;
    chatInput.focus();
    }, 600);
}

chatInput.addEventListener('input', () => {
    sendButton.disabled = !chatInput.value.trim();
});

chatInput.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);
chatInput.focus();