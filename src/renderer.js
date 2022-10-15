const electron = require("electron");
const ipc = electron.ipcRenderer;

document.addEventListener('DOMContentLoaded', function () {
    const status = document.getElementById('status')
    status.innerHTML = status.textContent.split(':')[0] + ': Connecting';
})

// Minimize
const minimize = document.getElementById("min-button");
minimize.addEventListener("click", function () {
    ipc.send("toggle-minimize-window");
});

// Resize
// const toggleRestoreMin = document.getElementById("restore-button");
// toggleRestoreMin.addEventListener("click", function () {
//     ipc.send("toggle-restore-window");
// });

// const toggleRestoreMax = document.getElementById("max-button");
// toggleRestoreMax.addEventListener("click", function () {
//     ipc.send("toggle-restore-window");
// });

// ipc.on("response", function (event, args) {
//     if (args === 'maximized') {
//         toggleRestoreMax.style.display = 'none';
//         toggleRestoreMin.style.display = 'flex';
//     }
//     if (args === 'unmaximized') {
//         toggleRestoreMax.style.display = 'flex';
//         toggleRestoreMin.style.display = 'none';
//     }
// });

// Close
const close = document.getElementById("close-button");
close.addEventListener("click", function () {
    ipc.send("toggle-close-window");
});

// Connection status
ipc.on('status', (event, err) => {
    const statusIcon = document.getElementById('status-icon');
    const status = document.getElementById('status');
    if (!err) {
        status.innerHTML = status.textContent.split(':')[0] + ': Connected';
        statusIcon.classList.remove('bi-info-circle-fill');
        statusIcon.classList.add('bi-check-circle-fill');
        statusIcon.style.color = 'rgb(180, 255, 167)';
    } else {
        status.innerHTML = status.textContent.split(':')[0] + ': ' + err;
        statusIcon.classList.remove('bi-info-circle-fill');
        statusIcon.classList.add('bi-x-circle-fill');
        statusIcon.style.color = 'rgb(254, 147, 147)';
    }
});