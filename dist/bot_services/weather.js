'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WeatherService = function () {
    function WeatherService() {
        _classCallCheck(this, WeatherService);

        this.apiKey = '798a73bf6df2e2e5e14e024b37f639a0';
    }

    _createClass(WeatherService, [{
        key: 'currentWeather',
        value: function currentWeather(city, callback) {
            callback('OK. Getting current weather for ' + city);
            _http2.default.get('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + this.apiKey + '&units=metric', function (res) {
                var body = '';
                res.on('data', function (d) {
                    body += d;
                });
                res.on('end', function () {
                    // Data reception is done, do whatever with it!
                    var data = JSON.parse(body);
                    var searchResHTML = 'The weather rigth now:<br /><br />';

                    var weather = data.weather[0];

                    searchResHTML += '<img src="http://openweathermap.org/img/w/' + weather.icon + '.png" /><br />';
                    searchResHTML += 'Location: ' + data.name + '<br />';
                    searchResHTML += 'Temperature: ' + data.main.temp + '&deg;C<br />';
                    searchResHTML += 'Cloud Cover: ' + data.clouds.all + '%<br />';

                    callback(searchResHTML);
                });
            });
        }
    }, {
        key: 'forcastedWeather',
        value: function forcastedWeather(city, callback) {
            callback('OK. Getting forcasted weather for ' + city);
            _http2.default.get('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&APPID=' + this.apiKey + '&units=metric', function (res) {
                var body = '';
                res.on('data', function (d) {
                    body += d;
                });
                res.on('end', function () {
                    // Data reception is done, do whatever with it!
                    var data = JSON.parse(body);
                    var searchResHTML = '<div class="weather-scroller" style="padding: 10px; width: 100%; overflow-y: hidden; overflow-x: scroll; white-space: nowrap; font-family: monospace;">';

                    searchResHTML += data.list.map(function (listItem) {
                        var dateTime = new Date(listItem.dt_txt + ' GMT');
                        var weather = listItem.weather[0];
                        var weatherRes = '<div style="display: inline-block; vertical-align: middle; margin-right: 25px;">';
                        weatherRes += '<img src="http://openweathermap.org/img/w/' + weather.icon + '.png" /><br />';
                        weatherRes += dateTime.toLocaleTimeString() + '<br />';
                        weatherRes += dateTime.toLocaleDateString() + '<br />';
                        weatherRes += 'Temp: ' + listItem.main.temp + '&deg;C<br />';
                        weatherRes += 'Cloud Cover: ' + listItem.clouds.all + '%<br />';
                        weatherRes += '</div>';

                        return weatherRes;
                    }).join('');

                    searchResHTML += '</div>';
                    callback(searchResHTML);
                });
            });
        }
    }, {
        key: 'serve',
        value: function serve(callback, question, _ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                type = _ref2[0],
                city = _ref2[1];

            if (type === 'current') {
                this.currentWeather(city, callback);
            } else if (type === 'forcast') {
                this.forcastedWeather(city, callback);
            }
        }
    }]);

    return WeatherService;
}();

exports.default = WeatherService;