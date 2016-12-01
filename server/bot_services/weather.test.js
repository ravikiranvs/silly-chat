import test from 'ava';

var mockSingleResult = JSON.stringify({
    weather: [
        {
            icon: 'icon'
        }
    ],
    name: 'location',
    main: {
        temp: '30'
    },
    clouds: {
        all: 'cloud cover status'
    }
});

var mockForcastResult = JSON.stringify({
    list: [
        {
            dt_txt: '1/1/2016',
            weather: [
                {
                    icon: 'icon'
                }
            ],
            main: {
                temp: '30'
            },
            clouds: {
                all: 'cloud cover status'
            }
        }
    ]
});

var nock = require('nock');

nock('http://api.openweathermap.org')
    .get('/data/2.5/weather?q=location&APPID=798a73bf6df2e2e5e14e024b37f639a0&units=metric')
    .reply(200, mockSingleResult)
    .get('/data/2.5/forecast?q=location&APPID=798a73bf6df2e2e5e14e024b37f639a0&units=metric')
    .reply(200, mockForcastResult);

require('babel-register')({
    presets: ['es2015']
});

var WeatherService = require('./weather').default;


test.cb('Bot can get current weather.', t => {
    var weatherService = new WeatherService();
    var callbackCount = 0;
    weatherService.serve(function (resp) {
        if (callbackCount == 0) {
            t.true(resp == 'OK. Getting current weather for location');
            callbackCount++;
        }
        else if (callbackCount == 1) {
            t.true(resp.indexOf('The weather rigth now:') > -1);
            t.end();
        }
    }, '', ['current', 'location']);
});


test.cb('Bot can get forcasted weather.', t => {
    var weatherService = new WeatherService();
    var callbackCount = 0;
    weatherService.serve(function (resp) {
        if (callbackCount == 0) {
            t.true(resp == 'OK. Getting forcasted weather for location');
            callbackCount++;
        }
        else if (callbackCount == 1) {
            t.true(resp.indexOf('<div class="weather-scroller"') > -1);
            t.end();
        }
    }, '', ['forcast', 'location']);
});