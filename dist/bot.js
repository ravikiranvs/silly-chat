'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rivescript = require('rivescript');

var _rivescript2 = _interopRequireDefault(_rivescript);

var _search = require('./bot_services/search');

var _search2 = _interopRequireDefault(_search);

var _weather = require('./bot_services/weather');

var _weather2 = _interopRequireDefault(_weather);

var _movies = require('./bot_services/movies');

var _movies2 = _interopRequireDefault(_movies);

var _todo = require('./bot_services/todo');

var _todo2 = _interopRequireDefault(_todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SillyChatBot = function () {
  // Initializes the bot from rive script
  function SillyChatBot() {
    _classCallCheck(this, SillyChatBot);

    var bot = new _rivescript2.default();

    bot.loadFile('server/bot.rive', function (batch_num) {
      // eslint-disable-next-line no-console
      console.log('Bot loaded! Batch No: ' + batch_num);
      bot.sortReplies();
    }, function (error, batch_num) {
      // eslint-disable-next-line no-console
      console.error('Bot errored! Batch No: ' + batch_num);
      // eslint-disable-next-line no-console
      console.error(error);
    });

    this.bot = bot;

    this.registeredServices = [{
      name: 'search',
      provider: new _search2.default()
    }, {
      name: 'weather',
      provider: new _weather2.default()
    }, {
      name: 'movie',
      provider: new _movies2.default()
    }, {
      name: 'todo',
      provider: new _todo2.default()
    }];
  }

  // Apply Bot Style for Html


  _createClass(SillyChatBot, [{
    key: 'styleReply',
    value: function styleReply(reply) {
      return '<div style="font-family: ROBOT; font-size: medium; color: #F4FBD5">' + reply + '</div>';
    }
  }, {
    key: 'botReply',
    value: function botReply(user, question, cb) {
      var _this = this;

      // Use bot style for all replies 
      var styledCallback = function styledCallback(reply) {
        return cb(_this.styleReply(reply));
      };

      try {
        var reply = this.bot.reply(user, user.replace(' ', '_') + ' ' + question);

        if (reply != 'ERR: No Reply Matched') {
          if (reply.indexOf('###') > 0) {
            (function () {
              var command = reply.split('###');
              var servicesForQuestion = _this.registeredServices.filter(function (service) {
                return service.name === command[0];
              });

              if (servicesForQuestion.length === 0) {
                styledCallback('I don\'t know how to do this yet :(');
              } else {
                servicesForQuestion.forEach(function (service) {
                  command.splice(0, 1);
                  service.provider.serve(styledCallback, question, command);
                });
              }
            })();
          } else {
            styledCallback(reply);
          }
        }
      } catch (err) {
        styledCallback('Sorry! I may have goofed up.<br /><br />Error: ' + err);
      }
    }
  }]);

  return SillyChatBot;
}();

exports.default = SillyChatBot;