import test from 'ava';
import React from 'react';
import Settings from './settings';
import { shallow } from 'enzyme';

var contextBase = {
    config: {
        getName: () => 'user1',
        getDisplayNotification: () => true,
        setName: () => {},
        setDisplayNotification: () => {}
    }
};

test('has the visible class when isVisible prop is true', t => {
    var context = Object.assign(contextBase);
    var settings = shallow(<Settings isVisible={true} close={() => {}} />, { context });
    t.true(settings.hasClass('settings showSideNav'));
});

test('no visible class when isVisible prop is true', t => {
    var context = Object.assign(contextBase);
    var settings = shallow(<Settings isVisible={false} close={() => {}} />, { context });
    t.true(settings.hasClass('settings'));
});

test('has input with name and checkbox for notification setting.', t => {
    var context = Object.assign(contextBase);
    var settings = shallow(<Settings isVisible={false} close={() => {}} />, { context });
    t.true(settings.find('input.settingsName').props().value == 'user1');
    t.true(settings.find('input.settingsNotification').props().checked == true);
});

test.cb('on name update and save calls the config setName method.', t => {
    var context = Object.assign(contextBase);
    context.config.setName = (name) => {
        t.true(name == 'newuser1');
        t.end();
    };
    var settings = shallow(<Settings isVisible={false} close={() => {}} />, { context });
    settings.find('input.settingsName').simulate('change', {target: {value: 'newuser1'}, preventDefault: () => {}});
    settings.find('button').simulate('click');
});