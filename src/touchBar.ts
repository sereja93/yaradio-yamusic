import {TouchBar} from 'electron';

const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar;


function createTouchBar(win: any) {

    const prev = new TouchBarButton({
        label: '◀️',
        click: () => {
            win.send('prev');
        },
    });

    const play = new TouchBarButton({
        label: '⏯️',
        click: () => {
            win.send('play');
        },
    });


    const next = new TouchBarButton({
        label: '▶️',
        click: () => {
            win.send('next');
        },
    });


    win.setTouchBar(new TouchBar({
        items: [
            prev, play, next,
        ],
    }));
}

export {createTouchBar};
