'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoogleService = function () {
    function GoogleService() {
        _classCallCheck(this, GoogleService);
    }

    _createClass(GoogleService, [{
        key: 'search',
        value: function search(query, callback) {
            callback('OK. Googling for: ' + query);
            _https2.default.get('https://www.googleapis.com/customsearch/v1?cx=005026335174976688145%3A_mkgntfmfgg&key=AIzaSyC8mDlqfkNKmX9go6_5WgRpRQ2bifiTqOM&q=' + query, function (res) {
                var body = '';
                res.on('data', function (d) {
                    body += d;
                });
                res.on('end', function () {
                    // Data reception is done, do whatever with it!
                    var data = JSON.parse(body);
                    var searchResHTML = 'Here are the search results:<br /><br /><ol style="padding-left: 15px; line-height: 1.5">';
                    for (var i = 0; i < data.items.length; i++) {
                        searchResHTML += '<li><a target="_blank" style="color: #fff" href="' + data.items[i].link + '">' + data.items[i].title + '</a></li>';
                    }
                    searchResHTML += '</ol>';
                    callback(searchResHTML);
                });
            });
        }
    }, {
        key: 'serve',
        value: function serve(callback, question, _ref) {
            var _ref2 = _slicedToArray(_ref, 1),
                query = _ref2[0];

            this.search(query, callback);
        }
    }]);

    return GoogleService;
}();

exports.default = GoogleService;