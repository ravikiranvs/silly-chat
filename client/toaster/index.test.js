import test from 'ava';

import Toast from './index';

test.serial('creates a notification object on show', t => {
    global.Notification = class NotificationMock {
        constructor(title, options) {
            t.true(title == 'test');
            t.true(options.body == 'test body');
        }

        close() {}
    };

    Toast.show('test', 'test body');
});

test.serial.cb('notification dies out after 4s', t => {
    var isCloseCalled = false;
    global.Notification = class NotificationMock {
        constructor(title, options) {
            t.true(title == 'test');
            t.true(options.body == 'test body');
        }

        close() {
            isCloseCalled = true;
        }
    };

    Toast.show('test', 'test body');

    setTimeout(() => {
        t.true(isCloseCalled);
        t.end();
    }, 4200);
});