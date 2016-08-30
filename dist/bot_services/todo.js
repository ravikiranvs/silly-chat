'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TodoService = function () {
  function TodoService() {
    _classCallCheck(this, TodoService);

    this.userName = 'silly.chat.bot';
    this.password = 'nothingtosee';

    this.rtmMail = 'ravikiranvs+6829a0@rmilk.com';
    this.rtmInboxUrl = 'https://www.rememberthemilk.com/home/ravikiranvs/';
  }

  _createClass(TodoService, [{
    key: 'addTask',
    value: function addTask(task, callback) {
      var _this = this;

      callback('OK. Adding task <u>' + task + '</u> to Remember The Milk');
      var nodemailer = require('nodemailer');

      // create reusable transporter object using the default SMTP transport 
      var transporter = nodemailer.createTransport('smtps://' + this.userName + '%40gmail.com:' + this.password + '@smtp.gmail.com');

      // setup e-mail data with unicode symbols 
      var mailOptions = {
        from: '"silly-chat" <' + this.userName + '@gmail.com>', // sender address 
        to: this.rtmMail, // list of receivers 
        subject: task, // Subject line 
        text: task, // plaintext body 
        html: '<b>' + task + '</b>' // html body 
      };

      // send mail with defined transport object 
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          callback(':( I Goofed up: ' + error + ' ' + info);
        }
        callback('Task added: see <a target="_blank" href="' + _this.rtmInboxUrl + '">Inbox</a>');
      });
    }
  }, {
    key: 'serve',
    value: function serve(callback, question, _ref) {
      var _ref2 = _slicedToArray(_ref, 1);

      var task = _ref2[0];

      this.addTask(task, callback);
    }
  }]);

  return TodoService;
}();

exports.default = TodoService;