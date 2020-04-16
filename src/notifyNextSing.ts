import {BrowserWindow} from 'electron';
import {notify} from './notification';


function createNotifySing(win: BrowserWindow) {

    return sendNotify;

    function sendNotify() {
        win.webContents.executeJavaScript('externalAPI.getCurrentTrack()')
            .then((result) => {
                return notify(
                    result.title, result.artists.map((artist: any) => {
                        return artist.title;
                    }).join(),
                    ('https://' + result.cover.replace('%%', '50x50')),
                    false);
            });

    }

}

export {createNotifySing};
