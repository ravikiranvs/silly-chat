import test from 'ava';

require('babel-register')({
    presets: ['es2015']
});

var proxyquire = require('proxyquire');
var mockNodemailer = {
    createTransport: function (smptConnection) {
        return {
            sendMail: function (mailOptions, callback) {
                callback(null, {});
            }
        }
    }
};

var TodoService = proxyquire('./todo', { 'nodemailer': mockNodemailer }).default;


test.cb('Bot can create a reminder', t => {
    var todoService = new TodoService();
    var responceCount = 0;
    todoService.serve(function (resp) {
        if (responceCount == 0) {
            t.true(resp == 'OK. Adding task <u>test</u> to Remember The Milk');
            responceCount++;
        } else if (responceCount == 1) {
            t.true(resp.indexOf('Task added: see') > -1);
            t.end();
        }
    }, null, ['test'])
});