import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

import Login from './login';

const context = {
    config: {
        getName: function () {
            return 'Username1'
        }
    }
};

test('has a div with class name login', t => {
    const wrapper = shallow(<Login />, { context });
    t.true(wrapper.hasClass('login'));
});

// test('renders two `.Bar`', t => {
//     const wrapper = shallow(<Foo/>);
//     t.is(wrapper.find('.bar').length, 2);
// });

// test('renders children when passed in', t => {
//     const wrapper = shallow(
//         <Foo>
//             <div className="unique"/>
//         </Foo>
//     );
//     t.true(wrapper.contains(<div className="unique"/>));
// });