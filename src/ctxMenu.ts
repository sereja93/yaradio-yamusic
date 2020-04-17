import * as path from 'path';
import {App, Menu, Tray, BrowserWindow, nativeTheme, app} from 'electron';
import {store} from './store';
import {notify} from './notification';


function ctxTpl(win: BrowserWindow, app: App): Array<any> {

    return [
        {
            label: 'Play | Pause',
            click: () => win.webContents.send('play'),
        },
        {
            label: 'Next Track',
            click: () => win.webContents.send('next'),
        },
        {
            label: 'Previous Track',
            click: () => win.webContents.send('prev'),
        },
        {
            type: 'separator',
        },
        {
            label: 'Like  | Dislike',
            click: () => win.webContents.send('like'),
        },
        {
            type: 'separator',
        },
        {
            label: 'Mute  | No mute',
            click: () => win.webContents.send('mute'),
        },
        {
            type: 'separator',
        },
        {
            label: 'Show/Hide App',
            click: function () {
                toggleWindowVisibility(win);
            },
        },
        {
            type: 'submenu',
            label: 'Settings',
            submenu: [{
                type: 'checkbox',
                label: 'Notification',
                checked: store.get('notifications'),
                click: () => {
                    const value = !store.get('notifications');
                    notify('Settings', value ? 'Notification enabled' : 'Notification disabled', null, true);
                    store.set('notifications', value);
                },
            }],
        },
        {
            label: 'Quit',
            click: function () {
                app.quit();
            },
        },
    ];
}

function toggleWindowVisibility(win: BrowserWindow) {
    if (win.isVisible()) {
        win.hide();
    } else {
        win.show();
    }
}

function createContextMenu(win: BrowserWindow, app: App): Tray {
    const iconPath = path.join(__dirname, '../', 'media/icon', contextMenuIcon());
    const ctxMenu = Menu.buildFromTemplate(ctxTpl(win, app));

    const appIcon = new Tray(iconPath);
    appIcon.setTitle('');

    appIcon.setContextMenu(ctxMenu);
    appIcon.addListener('click', (e) => {
        e.preventDefault();
        toggleWindowVisibility(win);
    });

    win.on('show', function () {
        appIcon.setTitle('');
    });
    nativeTheme.addListener('updated', () => updateTrayImage(appIcon));

    return appIcon;

}

function updateTrayImage(tray: Tray) {
    const iconPath = path.join(__dirname, '../', 'media/icon', contextMenuIcon());
    tray.setImage(iconPath);
}

function contextMenuIcon(): string {

    if (process.platform === 'darwin') {
        if (nativeTheme.shouldUseDarkColors) {
            return 'tray_white.png';
        } else {
            return 'tray_black.png';
        }
    }
    return 'music_16.png';
}

export {createContextMenu};
