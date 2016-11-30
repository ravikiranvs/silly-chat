import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

var proxyquire = require('proxyquire');
var messageFormatterMock = { default: function (val) { return val; } };
var Chat = proxyquire('./chat', { '../message-formatter': messageFormatterMock }).default;

var contextBase = {
    socket: {
        id: '1234',
        on: function (cb) { },
        emit: function (type, id) { }
    },
    windowVisibilityBroadcaster: {
        subscribe: function (cb) { }
    },
    config: {
        getName: function () { return 'user1' },
        getDisplayNotification: () => false
    }
};

test('component rendered with class "chat-window"', t => {
    var context = Object.assign({}, contextBase);
    const wrapper = shallow(<Chat />, { context });
    t.true(wrapper.hasClass('chat-window'));
});

test.cb('can send message.', t => {
    var context = Object.assign({}, contextBase);
    context.socket.emit = function (type, message) {
        t.true(type == 'chat message');
        var msgObj = JSON.parse(message);
        t.true(msgObj.message == 'test message');
        t.end();
    };
    const wrapper = shallow(<Chat />, { context });
    wrapper.find('textarea').simulate('change', { target: { value: 'test message' }, preventDefault: function () { } });
    wrapper.find('form').simulate('submit');
});

test.cb('can send message on enter key.', t => {
    var context = Object.assign({}, contextBase);
    context.socket.emit = function (type, message) {
        t.true(type == 'chat message');
        var msgObj = JSON.parse(message);
        t.true(msgObj.message == 'test message');
        t.end();
    };
    const wrapper = shallow(<Chat />, { context });
    wrapper.find('textarea').simulate('change', { target: { value: 'test message' }, preventDefault: function () { } });
    wrapper.find('textarea').simulate('keyup', { keyCode: 13 });
});

test.cb('can receive a message.', t => {
    var context = Object.assign({}, contextBase);
    context.socket.on = function (type, callback) {
        t.true(type == 'chat message');
        setTimeout(function () {
            callback(JSON.stringify({
                userId: '0987',
                username: 'user2',
                message: 'test message',
                time: new Date()
            }));
        }, 10);
    };
    const wrapper = shallow(<Chat />, { context });
    setTimeout(function () {
        t.true(wrapper.find('li').length == 1);
        t.true(wrapper.find('li').hasClass('bubble you'));
        t.end();
    }, 50);
});

test.cb('can receive self message.', t => {
    var context = Object.assign({}, contextBase);
    context.socket.on = function (type, callback) {
        t.true(type == 'chat message');
        setTimeout(function () {
            callback(JSON.stringify({
                userId: '1234',
                username: 'user1',
                message: 'test message',
                time: new Date()
            }));
        }, 10);
    };
    const wrapper = shallow(<Chat />, { context });
    setTimeout(function () {
        t.true(wrapper.find('li').length == 1);
        t.true(wrapper.find('li').hasClass('bubble me'));
        t.end();
    }, 50);
});

test.cb('render self message even after reconnection.', t => {
    var context = Object.assign({}, contextBase);
    context.socket.on = function (type, callback) {
        t.true(type == 'chat message');
        setTimeout(function () {
            callback(JSON.stringify({
                userId: '1240',
                username: 'user1',
                message: 'test message',
                time: new Date()
            }));
        }, 10);
    };
    const wrapper = shallow(<Chat />, { context });
    setTimeout(function () {
        t.true(wrapper.find('li').length == 1);
        t.true(wrapper.find('li').hasClass('bubble me'));
        t.end();
    }, 50);
});

// test('page title changes if browser is inactive.', t => {
//     t.true(true);
// });

// test('show nofication if browser is inactive.', t => {
//     t.true(true);
// });

// test('the nofification settings can disable notifications.', t => {
//     t.true(true);
// });