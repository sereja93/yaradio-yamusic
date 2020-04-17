import {TouchBar} from 'electron';

const {TouchBarButton, TouchBarSpacer} = TouchBar;


function createTouchBar(win: any) {


    const like = new TouchBarButton({
        label: 'Like|Dislike',
        click: () => {
            win.send('like');
        },
    });


    win.setTouchBar(new TouchBar({
        items: [
            new TouchBarSpacer({size: 'small'}), like,
        ],
    }));
}

export {createTouchBar};
