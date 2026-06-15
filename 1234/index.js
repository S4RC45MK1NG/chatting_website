import { io } from "https://cdn.socket.io/4.8.3/socket.io.esm.min.js";

const socket = io();

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


const myuser = getuser_cookie();


// First Connection
socket.on('connect', () => {
    console.log(socket.id);
    socket.emit("user", myuser)

});

socket.on("message", (text) => {
    const split_txt = text.split(":");
    const user = split_txt[0];
    const msg = split_txt.slice(1).join(":");

    console.log(text)
    if (user != myuser) {
        var audio = new Audio('notif_sound.mp3');
        audio.play();
    }

    appendMessage(msg, user);

})


// Debugging
socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
});

socket.on("connect_error", (err) => {
    console.log("Connect error:", err.message);
});



function appendMessage(text, user) {
    const message = document.createElement('article');
    message.className = 'message ' + user;
    let userLabel = user;

    if (userLabel === myuser) {
        userLabel = "You";
    }

    let sect = text.split(" ");
    var link_loc;
    for (var i=0; i < sect.length; i++) {
        if (sect[i].slice(0, 3) == "http") {
            sect[i] = `<a href="${sect[i]}">${sect[i]}</a>`;
        }
    }

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

    socket.emit("message", `${myuser}:${text}`);

    chatInput.value = '';
    sendButton.disabled = true;
    setTimeout(() => {
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