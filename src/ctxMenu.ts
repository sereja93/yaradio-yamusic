import * as path from 'path';
import {App, Menu, Tray} from 'electron';
import {store} from './store';
import {notify} from './notification';


const iconPath = path.join(__dirname, '../', 'media/icon', 'music_16.png');


function ctxTpl(win: any, app: App): Array<any> {

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

function toggleWindowVisibility(win: any) {
    if (win.isVisible()) {
        win.hide();
    } else {
        win.show();
    }
}

function createContextMenu(win: any, app: App) {

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

}

export {createContextMenu};
