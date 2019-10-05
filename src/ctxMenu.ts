import * as path from 'path';
import * as store from './store';
import {StorageKeys} from './store';
import * as notification from './notification';
import * as ElectronStore from 'electron-store';
import {App, Menu, Tray} from 'electron';


const iconPath = path.join(__dirname, '../', 'media/icon', 'music_16.png');


function ctxTpl(win: any, app: App): Array<any> {
    const storage = (store as ElectronStore<StorageKeys>);

    return [
        {
            label: 'Play | Pause',
            click: () => win.send('play'),
        },
        {
            label: 'Next Track',
            click: () => win.send('next'),
        },
        {
            type: 'separator',
        },
        {
            label: 'Like',
            click: () => win.send('like'),
        },
        {
            label: 'Dislike',
            click: () => win.send('dislike'),
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
                checked: storage.get('notifications'),
                click: () => {
                    const value = !storage.get('notifications');
                    (notification as any).notifi('Settings', value ? 'Notification enabled' : 'Notification disabled', null, true);
                    storage.set('notifications', value);
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

function toggleWindowVisibility(win: any) {
    if (win.isVisible()) {
        win.hide();
    } else {
        win.show();
    }
}

module.exports.create = (win: any, app: any) => {

    const ctxMenu = Menu.buildFromTemplate(ctxTpl(win, app));

    const appIcon = new Tray(iconPath);

    appIcon.setContextMenu(ctxMenu);
    appIcon.addListener('click', (e) => {
        e.preventDefault();
        toggleWindowVisibility(win);
    });

    win.on('show', function () {
        appIcon.setHighlightMode('always');
    });

};
