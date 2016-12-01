import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

import Login from './login';

test('has a div with class name login and an empty inputbox.', t => {
    const context = {
        config: {
            getName: function () {
                return null;
            }
        }
    };
    const wrapper = shallow(<Login />, { context });
    t.true(wrapper.hasClass('login'));
    t.true(wrapper.find('input').props().value == '');
});

test('textbox can take a username.', t => {
    let name = null;
    const context = {
        config: {
            getName: function () {
                return name;
            },
            setName: function (userName) {
                name = userName;
            }
        }
    };
    const wrapper = shallow(<Login />, { context });
    wrapper.find('input').simulate('change', { target: { value: 'UserName1' } });
    t.true(wrapper.find('input').props().value == 'UserName1');
});

test.cb('on enter key press the setName function gets called and then the login prop function.', t => {
    let loginCalled = false, setNameCalled = false;
    const context = {
        config: {
            getName: function () {
                return 'UserName1';
            },
            setName: function (userName) {
                setNameCalled = true;
                t.true(userName == 'UserName1');
            }
        }
    };

    const loginFunction = function () {
        loginCalled = true;
    };

    setTimeout(function () {
        t.true(loginCalled && setNameCalled);
        t.end();
    }, 100);

    const wrapper = shallow(<Login login={loginFunction} />, { context });
    wrapper.find('input').simulate('keyup', { keyCode: 13 });
});