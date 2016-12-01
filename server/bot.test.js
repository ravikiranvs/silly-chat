import test from 'ava';

require('babel-register')({
    presets: ['es2015']
});

var SillyChatBot = require('./bot').default;

test.cb('Can handle errors.', t => {
    var bot = new SillyChatBot();
    bot.bot = {
        reply: function () { throw new Error('Unexpected error.'); }
    };

    bot.botReply('userName', 'question', function(resp){
        t.true(resp.indexOf('Sorry! I may have goofed up') > -1);
        t.end();
    });
});

test.cb('Buffers replies which don\'t need a service.', t => {
    var bot = new SillyChatBot();
    bot.bot = {
        reply: function () { return 'no services required'; }
    };

    bot.botReply('userName', 'question', function(resp){
        t.true(resp.indexOf('no services required') > -1);
        t.end();
    });
});

test.cb('Can use a service if needed.', t => {
    var bot = new SillyChatBot();
    bot.registeredServices = [{
        name: 'serviceName',
        provider: {
            serve: function(cb){cb('bot reply');}
        }
    }];
    bot.bot = {
        reply: function () { return 'serviceName###data'; }
    };

    bot.botReply('userName', 'question', function(resp){
        t.true(resp.indexOf('bot reply') > -1);
        t.end();
    });
});

test.cb('Consedes if a service is not registered.', t => {
    var bot = new SillyChatBot();
    bot.bot = {
        reply: function () { return 'serviceName###data'; }
    };

    bot.botReply('userName', 'question', function(resp){
        t.true(resp.indexOf('I don\'t know how to do this yet :(') > -1);
        t.end();
    });
});