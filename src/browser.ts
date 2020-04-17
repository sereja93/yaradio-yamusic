import {webFrame, ipcRenderer, shell} from 'electron';


function exec(command: string) {
    webFrame.executeJavaScript(`if (externalAPI) { ${command} }`);
}


ipcRenderer.on('play', () => exec('externalAPI.togglePause()'));
ipcRenderer.on('next', () => exec('externalAPI.next()'));
ipcRenderer.on('prev', () => exec('externalAPI.prev()'));
ipcRenderer.on('like', () => exec('externalAPI.toggleLike()'));
ipcRenderer.on('mute', () => exec('externalAPI.toggleMute()'));

// Remove href from yandex logo
document.onreadystatechange = () => {
    jQuery('div.footer__left').find('.link').removeAttr('href');
    jQuery('div.nav__level').find('.footer__static-text').find('.link').removeAttr('href');
};

// Init function loader
document.addEventListener('DOMContentLoaded', () => {
    if (/radio/.test(location.origin)) {
        initRadio();
    } else if (/music/.test(location.origin)) {
        initMusic();
    }
});

// Yandex.Radio init function
function initRadio() {
    addSwitcher('', 'no__active');
}

// Yandex.Music init function
function initMusic() {
    addSwitcher('no__active', '');
}

// Switching between radio and music
function addSwitcher(yandexRadioClass: string, yandexMusicClass: string) {
    const divBlock = document.createElement('div');
    divBlock.className = 'block-selector';
    divBlock.innerHTML = `
      <div class="yaradio ${yandexRadioClass}"></div>
      <div class="yamusic ${yandexMusicClass}"></div>
    `;

    if (yandexMusicClass) {
        divBlock.style.left = '5rem';
    }

    divBlock.querySelector<HTMLDivElement>('.yaradio').onclick = () => {
        window.location.assign('https://radio.yandex.ru/');
    };
    divBlock.querySelector<HTMLDivElement>('.yamusic').onclick = () => {
        window.location.assign('https://music.yandex.ru/');
    };

    const pageRoot = document.querySelector('.page-root');

    if (pageRoot.querySelector('.head.deco-pane')) {
        pageRoot.insertBefore(divBlock, pageRoot.querySelector('.head').nextSibling);
        return;
    }

    pageRoot.insertBefore(divBlock, pageRoot.querySelector('.overlay'));
}
