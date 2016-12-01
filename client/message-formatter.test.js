import test from 'ava';
import msgFormatter from './message-formatter';

global.emojione = { toImage: function (val) { return val; } };

test('returns plain message', t => {
    t.true(msgFormatter('test message') == 'test message');
});

test('replaces emoji for emojione', t => {
    t.true(msgFormatter('happy :) :( :P :D :*') == 'happy :blush: :disappointed: :stuck_out_tongue_winking_eye: :smile: :kissing_heart:');
});

test('replaces linebreak with <br />', t => {
    t.true(msgFormatter('line1\nline2') == 'line1<br />line2');
});