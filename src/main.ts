import {app, BrowserWindow, NativeImage, session, WebContents, systemPreferences} from 'electron';

import * as path from 'path';
import * as fs from 'mz/fs';

import {StorageKeys, store} from './store';
import {createContextMenu} from './ctxMenu';
import {createGlobalShortcuts} from './globalShortcut';
import {createNotifySing} from './notifyNextSing';
import * as ElectronStore from 'electron-store';
import {createTouchBar} from './touchBar';


const appName = 'Yandex Music';
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

function createWindow(): BrowserWindow {


    const lastWindowState = store.get('lastWindowState');
    const lastApp = store.get('lastApp');

    browserWindow = new BrowserWindow({
        title: appName,
        show: false,
        x: lastWindowState.x,
        y: lastWindowState.y,
        height: lastWindowState.height || 700,
        width: lastWindowState.width || 848,
        icon: path.join(__dirname, 'media/icon', 'music_256.png'),
        titleBarStyle: 'default',
        minHeight: 700,
        minWidth: 848,
        autoHideMenuBar: true,
        backgroundColor: '#fff',
        webPreferences: {
            preload: path.join(__dirname, 'browser.js'),
            nodeIntegration: false,
            plugins: true,
        },
    });


    createTouchBar(browserWindow);

    browserWindow.loadURL((() => {
        if (lastApp === appName) {
            return 'https://music.yandex.ru/';
        }
        return 'https://radio.yandex.ru/';
    })());

    browserWindow.on('close', e => {
        if (!store.get('quit')) {
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
            browserWindow.setTitle('Yandex Radio');
            if (process.platform !== 'win32') {
                app.getFileIcon(path.join(__dirname, '../media/icon', 'yaradio_32x32.png'))
                    .then((image: NativeImage) => {
                        browserWindow.setIcon(image);
                    });
            }
        } else {
            browserWindow.setTitle('Yandex Music');
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
    systemPreferences.isTrustedAccessibilityClient(true);
    browserWindow = createWindow();
    createContextMenu(browserWindow, app);
    createGlobalShortcuts(browserWindow, app);
    browserWindow.setMenu(null);
    const page: WebContents = browserWindow.webContents;
    page.on('dom-ready', () => {
        page.insertCSS(fs.readFileSync(path.join(__dirname, '../css.css'), 'utf8'));
        browserWindow.show();
    });

    const sendNotify = createNotifySing(browserWindow);

    session.defaultSession.webRequest.onBeforeRequest({urls: ['*://*/*']}, (details, callback) => {
        // Skip advertising
        if (/awaps.yandex.net/.test(details.url) || /vh-bsvideo-converted/.test(details.url) || /get-video-an/.test(details.url)) {
            return {
                cancel: true,
            };
        }
        // Notification for next sing
        if (/start\?__t/.test(details.url)) {
            setTimeout(sendNotify, 1000);
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
