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

var MoviesService = function () {
  function MoviesService() {
    _classCallCheck(this, MoviesService);

    this.apiKey = '715cc933f7a7c58610d3ae41cac87ae2';
  }

  _createClass(MoviesService, [{
    key: 'createHtmlFromResponse',
    value: function createHtmlFromResponse(res, callback) {
      var body = '';
      res.on('data', function (d) {
        body += d;
      });

      res.on('end', function () {
        // Data reception is done, do whatever with it!
        var data = JSON.parse(body);
        var searchResHTML = '';

        searchResHTML += '<table><tbody>';
        searchResHTML += data.results.splice(0, 5).map(function (movie) {
          return '<tr>' + '<td><img src="http://image.tmdb.org/t/p/w300' + movie.poster_path + '" height="100px;" /></td>' + '<td width="200px">' + movie.title + '<br /><span style="color: blue;">' + movie.vote_average + '</span></td>' + '<td>' + movie.overview + '</td>' + '</tr>';
        }).join('');
        searchResHTML += '</tbody></table>';

        callback(searchResHTML);
      });
    }
  }, {
    key: 'nowPlaying',
    value: function nowPlaying(callback) {
      var _this = this;

      callback('OK. Getting the latest movies');
      _https2.default.get('https://api.themoviedb.org/3/movie/now_playing?api_key=' + this.apiKey, function (res) {
        _this.createHtmlFromResponse(res, callback);
      });
    }
  }, {
    key: 'top',
    value: function top(callback) {
      var _this2 = this;

      callback('OK. Getting the top rated movies');
      _https2.default.get('https://api.themoviedb.org/3/movie/top_rated?api_key=' + this.apiKey, function (res) {
        _this2.createHtmlFromResponse(res, callback);
      });
    }
  }, {
    key: 'search',
    value: function search(searchTerm, callback) {
      var _this3 = this;

      callback('OK. Searching for:' + searchTerm);
      _https2.default.get('https://api.themoviedb.org/3/search/movie?query=' + searchTerm + '&api_key=' + this.apiKey, function (res) {
        _this3.createHtmlFromResponse(res, callback);
      });
    }
  }, {
    key: 'serve',
    value: function serve(callback, question, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          type = _ref2[0],
          searchTerm = _ref2[1];

      if (type === 'now_playing') {
        this.nowPlaying(callback);
      } else if (type === 'top') {
        this.top(callback);
      } else if (type === 'search') {
        this.search(searchTerm, callback);
      }
    }
  }]);

  return MoviesService;
}();

exports.default = MoviesService;