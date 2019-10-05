import * as ElectronStore from 'electron-store';


export interface StorageKeys {
    quit: boolean;
    notifications: boolean;
    lastApp: string;
    lastWindowState: any;
}

const store = new ElectronStore<StorageKeys>({
    defaults: {
        notifications: true,
        lastApp: '',
        lastWindowState: {},
        quit: false,
    },
});


store.set('quit', false);

module.exports = store;
