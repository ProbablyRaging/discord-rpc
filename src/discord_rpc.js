const DiscordRPC = require('discord-rpc');

module.exports = () => {
    clientId = '977292001718464592';
    mainWindow.webContents.send('retry');
    setTimeout(() => {
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

        rpc.login({ clientId }).catch((err) => {
            setTimeout(() => {
                mainWindow.webContents.send('status', err);
            }, 1500);
        });
    }, 5000);
}