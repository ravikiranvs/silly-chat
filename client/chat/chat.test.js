import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

import Chat from './chat';

var contextBase = {
    socket: {
        id: '1234',
        on: function (cb) { },
        emit: function (type, id) { }
    },
    windowVisibilityBroadcaster: {
        subscribe: function (cb) { }
    }
};

test('component rendered with class "chat-window"', t => {
    var context = Object.assign({}, contextBase);
    const wrapper = shallow(<Chat />, { context });
    t.true(wrapper.hasClass('chat-window'));
});

