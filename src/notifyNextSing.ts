import * as notification from './notification';
import {BrowserWindow} from 'electron';

const getTrack = `
  ;(function(){
    let trackName, trackVer;
    if(/radio/.test(location.hostname)){
      trackName = document.querySelector('.player-controls__title') && document.querySelector('.player-controls__title').getAttribute('title') || ''
      return trackName
    }

    trackName = document.querySelector('.track__title') && document.querySelector('.track__title').textContent || ''
    trackVer = (document.querySelector('.track__ver') && document.querySelector('.track__ver').textContent) || ''
    return trackName + ' ' + trackVer
  })();
`;
const getArtist = `
  ;(function(){
    let trackArtist;
    if(/radio/.test(location.hostname)){
      trackArtist = document.querySelector('.player-controls__artists') && document.querySelector('.player-controls__artists').getAttribute('title') || ''
      return trackArtist
    }

    trackArtist = document.querySelectorAll('.track__artists a')
    return Array.from(trackArtist).map((e)=> e.textContent).join(', ')
  })();
`;
const getImg = `
  ;(function(){
    let trackImg;
    if(/radio/.test(location.hostname)){
      trackImg = document.querySelector('.slider__item_playing .track__cover') && document.querySelector('.slider__item_playing .track__cover').style.backgroundImage || ''
      return 'https:' + trackImg.replace('url("','').replace('")','').replace('50x50', '100x100')
    }

    trackImg = document.querySelector('.track-cover img') && document.querySelector('.track-cover img').getAttribute('src') || ''
    return 'https:' + trackImg.replace('50x50', '100x100')
  })();
`;

function createNotifySing(win: BrowserWindow) {

    return sendNotify;

    function sendNotify() {
        Promise.all([getInfoFromDOM(getTrack), getInfoFromDOM(getArtist), getInfoFromDOM(getImg)]).then((v) => {
            if (v[0] && v[1]) {
                (notification as any).notifi(v[0], v[1], v[2], false);
            }
        });
    }

    async function getInfoFromDOM(command: any) {
        const checkData = async () => {
            return await win.webContents.executeJavaScript(command);
        };
        return await checkData();
    }
}

export {createNotifySing};
