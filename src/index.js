const { app, BrowserWindow, Menu, Tray } = require('electron');
const ipc = require("electron").ipcMain;
const path = require('path');
const initRPC =  require('./discord_rpc');

// require('electron-reloader')(module);

if (require('electron-squirrel-startup')) {
    app.quit();
}

app.on('ready', () => {
    const appIcon = path.join(__dirname, "icon.png");
    const appIconFill = path.join(__dirname, "icon_fill.png");
    const iconOpen = path.join(__dirname, "icon_open.png");

    // Create the browser window.
    mainWindow = new BrowserWindow({
        title: 'ForTheContent RPC',
        icon: appIconFill,
        frame: false,
        // show: false,
        autoHideMenuBar: true,
        width: 300,
        height: 130,
        // width: 1200,
        // height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.setResizable(false);
    // mainWindow.hide();
    // mainWindow.webContents.openDevTools();

    const tray = new Tray(appIconFill);
    const contextMenu = Menu.buildFromTemplate([{
        label: "Open",
        type: "normal",
        click: showWindow,
    }, {
        label: "Restart",
        type: "normal",
        click: refreshApp,
    }, {
        label: "Quit",
        type: "normal",
        click: quitApp,
    }]);

    tray.setToolTip("ForTheContent RPC");
    tray.setContextMenu(contextMenu);

    tray.on('click', function() {
        mainWindow.show();
     })

    mainWindow.on('minimize', function (event) {
        event.preventDefault();
        mainWindow.setSkipTaskbar(true);
    });

    initRPC();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle minimize button
ipc.on("toggle-minimize-window", function (event) {
    mainWindow.minimize();
});

// Handle close button
ipc.on("toggle-close-window", function (event) {
    mainWindow.close();
});

// Retry connection
ipc.on("retry-connection", function (event) {
    initRPC();
});

// Functions
function showWindow() {
    mainWindow.setSkipTaskbar(false);
    mainWindow.show();
}

function refreshApp() {
    app.relaunch();
    app.exit();
}

function quitApp() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}