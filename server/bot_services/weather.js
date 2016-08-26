import http from 'http';

class WeatherService {
  constructor() {
    this.apiKey = '798a73bf6df2e2e5e14e024b37f639a0';
  }

  currentWeather(city, callback) {
    callback(`OK. Getting current weather for ${city}`);
    http.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${this.apiKey}&units=metric`,
      function (res) {
        var body = '';
        res.on('data', function (d) {
          body += d;
        });
        res.on('end', function () {
          // Data reception is done, do whatever with it!
          var data = JSON.parse(body);
          let searchResHTML = 'The weather rigth now:<br /><br />';

          const weather = data.weather[0];

          searchResHTML += '<img src="http://openweathermap.org/img/w/' + weather.icon + '.png" /><br />';
          searchResHTML += 'Location: ' + data.name + '<br />';
          searchResHTML += 'Temperature: ' + data.main.temp + '&deg;C<br />';
          searchResHTML += 'Cloud Cover: ' + data.clouds.all + '%<br />';

          callback(searchResHTML);
        });
      });
  }


  forcastedWeather(city, callback) {
    callback(`OK. Getting forcasted weather for ${city}`);
    http.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${this.apiKey}&units=metric`,
      function (res) {
        var body = '';
        res.on('data', function (d) {
          body += d;
        });
        res.on('end', function () {
          // Data reception is done, do whatever with it!
          var data = JSON.parse(body);
          let searchResHTML = '<div class="weather-scroller" style="padding: 10px; width: 100%; overflow-y: hidden; overflow-x: scroll; white-space: nowrap; font-family: monospace;">';

          searchResHTML += data.list.map(function (listItem) {
            var dateTime = new Date(listItem.dt_txt + ' GMT');
            const weather = listItem.weather[0];
            let weatherRes = '<div style="display: inline-block; vertical-align: middle; margin-right: 25px;">';
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

  serve(callback, question, [type, city]) {
    if (type === 'current') {
      this.currentWeather(city, callback);
    } else if (type === 'forcast') {
      this.forcastedWeather(city, callback);
    }
  }
}

export default WeatherService;