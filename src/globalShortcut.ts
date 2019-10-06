import {App, globalShortcut} from 'electron';


function shortcutTpl(win: any): Array<any> {
    return [
        {
            accelerator: 'MediaPlayPause',
            func: () => win.send('play'),
        },
        {
            accelerator: 'MediaNextTrack',
            func: () => win.send('next'),
        },
        {
            accelerator: 'MediaPreviousTrack',
            func: () => win.send('prev'),
        },
        {
            accelerator: 'VolumeMute',
            func: () => win.send('mute'),
        },
    ];
}

function createGlobalShortcuts(win: any, app: App) {
    const tplShortcut = shortcutTpl(win);

    tplShortcut.forEach((e) => {
        globalShortcut.register(e.accelerator, e.func);
    });

    app.on('will-quit', () => {
        // Unregister all shortcuts.
        globalShortcut.unregisterAll();
    });
}

export {createGlobalShortcuts};
