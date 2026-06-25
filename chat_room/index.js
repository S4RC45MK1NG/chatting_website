import { io } from "https://cdn.socket.io/4.8.3/socket.io.esm.min.js";

const socket = io();

// Defined main elements of the web app
const messageList = document.getElementById('messageList');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const theme_set = document.getElementById("mode-switch");
const link = document.getElementById('themeStyle'); // Reference to theme css file

// Theme Changer Button Code
theme_set.addEventListener("click", () => {
    if (theme_set.dataset.theme == "light") {
    link.href = "dark.css";
    theme_set.dataset.theme = "dark";
    theme_set.textContent = "🌙";
    console.log("set to dark mode");
    }
    else {
    link.href = "light.css"
    theme_set.dataset.theme = "light";
    theme_set.textContent = "☀️";
    console.log("set to light mode");
    }
})

// Get cookies function
function get_cookie(arg) {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');

        if (key === arg) {
            return value;
        }
    }

    return null;
}

// To get the required cookies
const myuser = get_cookie("chat-user");
const room_code = get_cookie("room-code");

// Status Check Element
const status = document.getElementById("status");
status.style.setProperty("--before-bg", "#d33e34");

// Connection 
socket.on('connect', () => {
    console.log(socket.id);
    status.textContent = "Online";
    status.style.setProperty("--before-bg", "#34d399");
    socket.emit("user", myuser)
    socket.emit("room", room_code)


    // testing href linking
    appendMessage("https://sigmaboi.hackclub.app/", "server")
});

// Messaging
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

// Code to send media
const mediaBtn = document.getElementById("mediaButton");



// Disconnect
socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
    status.textContent = "Offline";
    status.style.setProperty("--before-bg", "#d33e34");
});

// Connect Error
socket.on("connect_error", (err) => {
    console.log("Connect error:", err.message);
});


// Display Messages
function appendMessage(text, user) {
    const message = document.createElement('article');

    message.className = 'message ' + user;
    let userLabel = user;

    var is_sameUser = false;
    
    // Attempting to get last message
    var lastMessage;
    try {    
        lastMessage = messageList.lastChild;
        if (userLabel === lastMessage.dataset.user) {
            is_sameUser = true;
        }
    }
    catch (err) {
        const lastMessage = null;
        console.log(`Error Logged:\n${err}`);
        console.log("Couldn't get last message");
    }

    

    // Turns ur username into "You"
    if (userLabel === myuser) {
        userLabel = "You";
    }

    
    // Code to filter out hyperlinks
    var sect = text.split(" ");
    var link_loc;
    for (var i=0; i < sect.length; i++) {
        if (/^https?:\/\//i.test(sect[i]) || /^www./.test(sect[i])) {
            sect[i] = `<a href="${sect[i]}">${sect[i]}</a>`;
            console.log("found a link");
        }
        console.log(sect[i]);
    }
    const processedtxt = sect.join(" ")

    // Set an attribute to the message regarding the username
    message.setAttribute("data-user", user);

    // Code to bundle same-user messages
    if (lastMessage != null && is_sameUser) {
        lastMessage.innerHTML += `<p>${processedtxt}</p>`;
    }

    else {
        message.innerHTML = `
        <strong>${userLabel}</strong>
        <small>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
        <p>${processedtxt}</p>
        `;

        messageList.appendChild(message);
    }

    
    messageList.scrollTop = messageList.scrollHeight;
}

// Send Message to server
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
    sendButton.disabled = chatInput.value.trim() == "" || chatInput.value.trim() == null;
});

chatInput.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && chatInput.value.trim() != "") {
    event.preventDefault();
    sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);
chatInput.focus();