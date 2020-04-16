import {TouchBar} from 'electron';

const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar;


function createTouchBar(win: any) {

    const prev = new TouchBarButton({
        label: 'Previous️',
        click: () => {
            win.send('prev');
        },
    });

    const play = new TouchBarButton({
        label: 'Play|Stop️',
        click: () => {
            win.send('play');
        },
    });


    const next = new TouchBarButton({
        label: 'Next️',
        click: () => {
            win.send('next');
        },
    });

    const like = new TouchBarButton({
        label: 'Like|Dislike',
        click: () => {
            win.send('like');
        },
    });


    win.setTouchBar(new TouchBar({
        items: [
            new TouchBarSpacer({size: 'small'}), prev, play, next, , new TouchBarSpacer({size: 'large'}), like,
        ],
    }));
}

export {createTouchBar};
