import * as path from 'path';
import * as notifier from 'node-notifier';
import * as rp from 'request-promise';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import {StorageKeys, store} from './store';
import * as ElectronStore from 'electron-store';


async function notify(title: string, msg: string, img: string, force: boolean) {

    const filename = path.join(__dirname, '../../../media/tmp', 'image.jpeg');

    const storage = (store as ElectronStore<StorageKeys>);

    const sendNotify = function () {
        notifier.notify({
            title: title || 'YaRadio',
            message: msg || '-',
            icon: img ? filename : path.join(__dirname, '../../../media/icon', 'music_64.png'),
            sound: false,
            wait: false,
        }, function (err) {
            if (err) {
                console.log('Error: Notifier', err);
            }
        });
    };

    const write = function writeFile(pathFile: string, contents: string, cb: any) {
        mkdirp(path.dirname(pathFile), function (err) {
            if (err) return cb(err);
            fs.writeFile(pathFile, contents, {encoding: 'binary'}, cb);
        });
    };

    if (storage.get('notifications')) {
        if (img) {
            const dataImg = await rp.get(img, {encoding: 'binary'}).catch((err) => {
                console.log('Error: Notifier', err);
            });
            write(filename, dataImg,
                (err: any) => {
                    if (err) {
                        console.log('Error: Notifier', err);
                    } else {
                        sendNotify();
                    }
                });
        }
    }
}

export {notify};
