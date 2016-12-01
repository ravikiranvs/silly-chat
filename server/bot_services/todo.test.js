import test from 'ava';

require('babel-register')({
    presets: ['es2015']
});

var proxyquire = require('proxyquire');

test.cb('Bot can create a reminder', t => {
    var mockNodemailer = {
        createTransport: function() {
            return {
                sendMail: function(mailOptions, callback) {
                    callback(null, {});
                }
            };
        }
    };

    var TodoService = proxyquire('./todo', { 'nodemailer': mockNodemailer }).default;

    var todoService = new TodoService();
    var responceCount = 0;
    todoService.serve(function(resp) {
        if (responceCount == 0) {
            t.true(resp == 'OK. Adding task <u>test</u> to Remember The Milk');
            responceCount++;
        } else if (responceCount == 1) {
            t.true(resp.indexOf('Task added: see') > -1);
            t.end();
        }
    }, null, ['test']);
});

test.cb('Bot can handle error when creating a reminder', t => {
    var mockNodemailer = {
        createTransport: function() {
            return {
                sendMail: function(mailOptions, callback) {
                    callback(new Error('Something went wrong'), null);
                }
            };
        }
    };

    var TodoService = proxyquire('./todo', { 'nodemailer': mockNodemailer }).default;

    var todoService = new TodoService();
    var responceCount = 0;
    todoService.serve(function(resp) {
        if (responceCount == 0) {
            t.true(resp == 'OK. Adding task <u>test</u> to Remember The Milk');
            responceCount++;
        } else if (responceCount == 1) {
            t.true(resp.indexOf('I Goofed up') > -1);
            t.end();
        }
    }, null, ['test']);
});