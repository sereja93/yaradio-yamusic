const path = require('path');
const notifier = require('node-notifier');
const store = require('../store/store');
const rp = require('request-promise');
const fs = require('file-system');
const mkdirp = require('mkdirp');

exports.notifi = async (title, msg, img, force) => {

    let filename = path.join(__dirname, '../../media/tmp', 'image.jpeg');

    let sendNotify = function () {
        notifier.notify({
            title: title || 'YaRadio',
            message: msg || '-',
            icon: img ? filename : path.join(__dirname, '../../media/icon', 'music_64.png'),
            sound: false,
            wait: false
        }, function (err) {
            if (err) {
                console.log('Error: Notifier', err);
            }
        })
    };

    let write = function writeFile(pathFile, contents, cb) {
        mkdirp(path.dirname(pathFile), function (err) {
            if (err) return cb(err);
            fs.writeFile(pathFile, contents, {encoding: 'binary'}, cb);
        });
    };

    if (store.get('settings.notifications')) {
        if (img) {
            let dataImg = await rp.get(img, {encoding: 'binary'}).catch((err) => {
                console.log('Error: Notifier', err);
            });

            console.log(filename);
            write(filename, dataImg,
                (err) => {
                    if (err) {
                        console.log('Error: Notifier', err);
                        let sendNotify1 = function () {
                            notifier.notify({
                                title: title || 'YaRadio',
                                message: msg || '-',
                                icon: path.join(__dirname, '../../media/icon', 'music_64.png'),
                                sound: false,
                                wait: false
                            }, function (err) {
                                if (err) {
                                    console.log('Error: Notifier', err);
                                }
                            })
                        };
                        sendNotify1();
                    } else {
                        sendNotify()
                    }
                });
        } else {
            sendNotify();
        }
    } else if (force) {
        sendNotify();
    }
};