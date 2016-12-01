'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkMiddleware = function () {
    function LinkMiddleware() {
        _classCallCheck(this, LinkMiddleware);
    }

    _createClass(LinkMiddleware, [{
        key: 'serve',
        value: function serve(callback, question) {
            var urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
            var urls = question.match(urlRegex);
            if (urls) {
                if (urls.length > 1) {
                    callback('I found URLs! Let me create links for them.');
                    var liArray = urls.map(function (url) {
                        return '<li><a href="' + url + ' target="_blank">' + url + '</a></li>';
                    });
                    callback('<ul>' + liArray.join('') + '</ul>');
                }
                if (urls.length == 1) {
                    callback('I found a URL! Let me create a link for it.');
                    var _liArray = urls.map(function (url) {
                        return '<li><a href="' + url + ' target="_blank">' + url + '</a></li>';
                    });
                    callback('<ul>' + _liArray.join('') + '</ul>');
                }
            }
        }
    }]);

    return LinkMiddleware;
}();

exports.default = LinkMiddleware;