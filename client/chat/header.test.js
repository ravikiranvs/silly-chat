import test from 'ava';
import React from 'react';
import Header from './header';
import { shallow } from 'enzyme';

var contextBase = {
    config: {
        getName: () => 'user1'
    },
    socket: {
        id: '1234',
        on: () => { }
    }
};

test('has class "main-header" and no initial users.', t => {
    var context = Object.assign({}, contextBase);
    const header = shallow(<Header />, { context });
    t.true(header.hasClass('main-header'));
    t.true(header.find('li').length == 0);
});

test.cb('subscribes to user broadcast and displays all users.', t => {
    var context = Object.assign({}, contextBase);

    context.socket.on = (type, callback) => {
        if (type == 'users') {
            setTimeout(() => {
                callback({ '1234': 'user1', '0987': 'user2' });
            }, 10);
        }
    };
    const header = shallow(<Header />, { context });
    setTimeout(() => {
        t.true(header.find('li').length == 2);
        t.end();
    }, 30);
});

test.cb('highlights users who are typing for a few seconds.', t => {
    var context = Object.assign({}, contextBase);
    var isTypingCallback = null;
    context.socket.on = (type, callback) => {
        if (type == 'users') {
            setTimeout(() => {
                callback({ '1234': 'user1'});
            }, 10);
        } else if (type == 'chat isTyping') {
            isTypingCallback = callback;
        }
    };
    const header = shallow(<Header />, { context });
    setTimeout(() => {
        t.true(header.find('li').hasClass(''));
        isTypingCallback('1234');
        setTimeout(() => {
            t.true(header.find('li').hasClass('typing'));
            t.end();
        }, 10);
    }, 30);
});