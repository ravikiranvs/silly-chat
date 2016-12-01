import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

var toastFunc = () => {};
var proxyquire = require('proxyquire');
var messageFormatterMock = { default: function(val) { return val; } };
var Chat = proxyquire('./chat', {
    '../message-formatter': messageFormatterMock,
    '../toaster/index': {
        default: {
            show: function() {
                toastFunc();
            }
        }
    }
}).default;

var contextBase = {
    socket: {
        id: '1234',
        on: function() { },
        emit: function() { }
    },
    windowVisibilityBroadcaster: {
        subscribe: function() { },
        isHidden: () => false
    },
    config: {
        getName: function() { return 'user1'; },
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
    context.socket.emit = function(type, message) {
        t.true(type == 'chat message');
        var msgObj = JSON.parse(message);
        t.true(msgObj.message == 'test message');
        t.end();
    };
    const wrapper = shallow(<Chat />, { context });
    wrapper.find('textarea').simulate('change', { target: { value: 'test message' }, preventDefault: function() { } });
    wrapper.find('form').simulate('submit');
});

test.cb('can send message on enter key.', t => {
    var context = Object.assign({}, contextBase);
    context.socket.emit = function(type, message) {
        t.true(type == 'chat message');
        var msgObj = JSON.parse(message);
        t.true(msgObj.message == 'test message');
        t.end();
    };
    const wrapper = shallow(<Chat />, { context });
    wrapper.find('textarea').simulate('change', { target: { value: 'test message' }, preventDefault: function() { } });
    wrapper.find('textarea').simulate('keyup', { keyCode: 13 });
});

test.cb('can receive a message.', t => {
    var context = Object.assign({}, contextBase);
    context.socket.on = function(type, callback) {
        t.true(type == 'chat message');
        setTimeout(function() {
            callback(JSON.stringify({
                userId: '0987',
                username: 'user2',
                message: 'test message',
                time: new Date()
            }));
        }, 10);
    };
    const wrapper = shallow(<Chat />, { context });
    setTimeout(function() {
        t.true(wrapper.find('li').length == 1);
        t.true(wrapper.find('li').hasClass('bubble you'));
        t.end();
    }, 50);
});

test.cb('can receive self message.', t => {
    var context = Object.assign({}, contextBase);
    context.socket.on = function(type, callback) {
        t.true(type == 'chat message');
        setTimeout(function() {
            callback(JSON.stringify({
                userId: '1234',
                username: 'user1',
                message: 'test message',
                time: new Date()
            }));
        }, 10);
    };
    const wrapper = shallow(<Chat />, { context });
    setTimeout(function() {
        t.true(wrapper.find('li').length == 1);
        t.true(wrapper.find('li').hasClass('bubble me'));
        t.end();
    }, 50);
});

test.cb('render self message even after reconnection.', t => {
    var context = Object.assign({}, contextBase);
    context.socket.on = function(type, callback) {
        t.true(type == 'chat message');
        setTimeout(function() {
            callback(JSON.stringify({
                userId: '1240',
                username: 'user1',
                message: 'test message',
                time: new Date()
            }));
        }, 10);
    };
    const wrapper = shallow(<Chat />, { context });
    setTimeout(function() {
        t.true(wrapper.find('li').length == 1);
        t.true(wrapper.find('li').hasClass('bubble me'));
        t.end();
    }, 50);
});

test.serial.cb('page title changes and notification is shown if browser is inactive.', t => {
    var jsdom = require('jsdom').jsdom;
    global.document = jsdom('');
    global.window = document.defaultView;

    var tostShowWasCalled = false;
    toastFunc = () => {tostShowWasCalled = true;};

    var context = Object.assign({}, contextBase);
    context.windowVisibilityBroadcaster.isHidden = () => true;
    context.config.getDisplayNotification = () => true;
    context.socket.on = function(type, callback) {
        t.true(type == 'chat message');
        setTimeout(function() {
            callback(JSON.stringify({
                userId: '0987',
                username: 'user2',
                message: 'test message',
                time: new Date()
            }));
        }, 30);
    };
    shallow(<Chat />, { context });
    setTimeout(function() {
        t.true(global.document.title == 'new message');
        t.true(tostShowWasCalled);
        t.end();
    }, 60);
});


test.serial.cb('page title doesn\'t change and notification is not shown if browser is inactive and display notification is off.', t => {
    var jsdom = require('jsdom').jsdom;
    global.document = jsdom('');
    global.window = document.defaultView;

    var tostShowWasCalled = false;
    toastFunc = () => {tostShowWasCalled = true;};

    var context = Object.assign({}, contextBase);
    context.windowVisibilityBroadcaster.isHidden = () => true;
    context.config.getDisplayNotification = () => false;
    context.socket.on = function(type, callback) {
        t.true(type == 'chat message');
        setTimeout(function() {
            callback(JSON.stringify({
                userId: '0987',
                username: 'user2',
                message: 'test message',
                time: new Date()
            }));
        }, 30);
    };
    shallow(<Chat />, { context });
    setTimeout(function() {
        t.false(global.document.title == 'new message');
        t.false(tostShowWasCalled);
        t.end();
    }, 60);
});