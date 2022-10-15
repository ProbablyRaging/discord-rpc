const { app, BrowserWindow, Menu, Tray } = require('electron');
const ipc = require("electron").ipcMain;
const DiscordRPC = require('discord-rpc');
const path = require('path');

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
        height: 100,
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
    mainWindow.hide();
    // mainWindow.webContents.openDevTools();

    const tray = new Tray(appIconFill);
    const contextMenu = Menu.buildFromTemplate([{
        label: "Open",
        type: "normal",
        click: showWindow,
    },{
        label: "Quit",
        type: "normal",
        click: quitApp,
    }]);

    tray.setToolTip("ForTheContent RPC");
    tray.setContextMenu(contextMenu);

    mainWindow.on('minimize', function (event) {
        event.preventDefault();
        mainWindow.setSkipTaskbar(true);
    });

    function showWindow() {
        mainWindow.setSkipTaskbar(false);
        mainWindow.show();
    }
    function quitApp() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }
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

// Handle restore button
// ipc.on("toggle-restore-window", function (event, args) {
//     if (mainWindow.isMaximized()) {
//         mainWindow.unmaximize();
//         event.sender.send('response', 'unmaximized');
//     } else {
//         mainWindow.maximize();
//         event.sender.send('response', 'maximized');
//     }
// });

// Handle close button
ipc.on("toggle-close-window", function (event) {
    mainWindow.close();
});

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setActivity() {
    rpc.setActivity({
        details: `A Discord server for content`,
        state: 'creators',
        largeImageKey: 'server_logo',
        largeImageText: 'ForTheContent',
        smallImageKey: 'server_add',
        smallImageText: 'Join Now',
        buttons: [{
            "label": "Join Server",
            "url": "https://discord.gg/forthecontent"
        }],
        instance: true,
    });
    setTimeout(() => {
        mainWindow.webContents.send('status');
    }, 1500);
}

rpc.on('ready', () => {
    setActivity();
    setInterval(() => {
        setActivity();
    }, 15e3);
});

rpc.login({ clientId: '977292001718464592' }).catch((err) => {
    setTimeout(() => {
        mainWindow.webContents.send('status', err);
    }, 1500);
});