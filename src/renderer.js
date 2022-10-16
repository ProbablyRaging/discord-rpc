const electron = require("electron");
const ipc = electron.ipcRenderer;

document.addEventListener('DOMContentLoaded', function () {
    const status = document.getElementById('status')
    status.innerHTML = status.textContent.split(':')[0] + 'Connecting';
})

// Minimize
const minimize = document.getElementById("min-button");
minimize.addEventListener("click", function () {
    ipc.send("toggle-minimize-window");
});

// Close
const close = document.getElementById("close-button");
close.addEventListener("click", function () {
    ipc.send("toggle-close-window");
});

// Connection status
ipc.on('status', (event, err) => {
    const statusIcon = document.getElementById('status-icon');
    const status = document.getElementById('status');
    const retry = document.getElementById('retry');
    if (!err) {
        status.innerHTML = 'Connected';
        statusIcon.classList.remove('bi-info-circle-fill');
        statusIcon.classList.add('bi-check-circle-fill');
        statusIcon.style.color = 'rgb(180, 255, 167)';
    } else {
        status.innerHTML =  err;
        statusIcon.classList.remove('bi-info-circle-fill');
        statusIcon.classList.add('bi-x-circle-fill');
        statusIcon.style.color = 'rgb(254, 147, 147)';
        retry.style.display = 'flex';
    }
});

// Retry button
const retry = document.getElementById('retry');
retry.addEventListener("click", function () {
    ipc.send("retry-connection");
});

// Retry response
ipc.on('retry', (event) => {
    window.location.reload();
});