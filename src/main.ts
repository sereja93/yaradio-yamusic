import {app, BrowserWindow, session, NativeImage} from 'electron';

import * as path from 'path';
import * as fs from 'mz/fs';

import * as  store from './store';
import * as ctxMenu from './ctxMenu';
import * as globalShortcut from './globalShortcut';
import * as notifiNextSing from './notifiNextSing';
import {StorageKeys} from './store';
import * as ElectronStore from 'electron-store';


if (process.env.node_env === 'dev') {
    require('electron-debug')({
        enabled: true,
        showDevTools: 'undocked',
    });
}
let browserWindow: BrowserWindow;
const appRunning = app.requestSingleInstanceLock();

if (!appRunning) {
    app.quit();
}

app.on('second-instance', () => {
    if (browserWindow) {
        if (browserWindow.isMinimized()) {
            browserWindow.restore();
        }
        browserWindow.focus();
    }
});

function createWindow() {

    const storage = (store as ElectronStore<StorageKeys>);

    const lastWindowState = storage.get('lastWindowState');
    const lastApp = storage.get('lastApp');

    browserWindow = new BrowserWindow({
        title: 'YaRadio',
        show: false,
        x: lastWindowState.x,
        y: lastWindowState.y,
        height: lastWindowState.height || 700,
        width: lastWindowState.width || 848,
        icon: path.join(__dirname, 'media/icon', 'music_256.png'),
        titleBarStyle: 'hiddenInset',
        minHeight: 700,
        minWidth: 848,
        autoHideMenuBar: true,
        backgroundColor: '#fff',
        webPreferences: {
            preload: path.join(__dirname,  'browser.js'),
            nodeIntegration: false,
            plugins: true,
        },
    });
    browserWindow.loadURL((() => {
        if (lastApp === 'YaMusic') {
            return 'https://music.yandex.ru/';
        }
        return 'https://radio.yandex.ru/';
    })());

    browserWindow.on('close', e => {
        if (!storage.get('quit')) {
            e.preventDefault();
        }

        switch (process.platform) {
            case  'win32':
                browserWindow.hide();
                break;
            case 'linux':
                browserWindow.hide();
                break;
            case 'darwin':
                app.hide();
                break;
            default:
        }
    });

    browserWindow.on('page-title-updated', (e: any) => {
        const history = e.sender.webContents.history;
        if (/radio/.test(history[history.length - 1])) {
            browserWindow.setTitle('YaRadio');
            if (process.platform !== 'win32') {
                app.getFileIcon(path.join(__dirname, '../media/icon', 'yaradio_32x32.png'))
                    .then((image: NativeImage) => {
                        browserWindow.setIcon(image);
                    });
            }
        } else {
            browserWindow.setTitle('YaMusic');
            if (process.platform !== 'win32') {
                app.getFileIcon(path.join(__dirname, '../media/icon', 'yamusic_32x32.png'))
                    .then((image: NativeImage) => {
                        browserWindow.setIcon(image);
                    });
            }
        }
        e.preventDefault();
    });

    return browserWindow;
}

app.on('ready', () => {
    browserWindow = createWindow();
    (ctxMenu as any).create(browserWindow, app);
    (globalShortcut as any).init(browserWindow, app);
    browserWindow.setMenu(null);
    const page = browserWindow.webContents;
    page.on('dom-ready', () => {
        page.insertCSS(fs.readFileSync(path.join(__dirname, '../css.css'), 'utf8'));
        browserWindow.show();
    });

    const sendNotifi = (notifiNextSing as any).init(browserWindow);

    session.defaultSession.webRequest.onBeforeRequest({urls: ['*://*/*']}, (details, callback) => {
        // Skip advertising
        if (/awaps.yandex.net/.test(details.url) || /vh-bsvideo-converted/.test(details.url) || /get-video-an/.test(details.url)) {
            return {
                cancel: true,
            };
        }
        // Notification for next sing
        if (/start\?__t/.test(details.url)) {
            setTimeout(sendNotifi, 1000);
        }
        callback(details as any);
    });
});

app.on('before-quit', () => {
    const storage = (store as ElectronStore<StorageKeys>);

    storage.set('quit', true);

    if (!browserWindow.isFullScreen()) {
        storage.set('lastWindowState', browserWindow.getBounds());
    }

    storage.set('lastApp', browserWindow.getTitle());
});
