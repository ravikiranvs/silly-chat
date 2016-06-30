var RiveScript = require('rivescript');
var https = require('https');
var http = require('http');
var httpReq = https;

var bot = new RiveScript();
bot.loadFile("server/bot.rive",
  function (batch_num) {
    console.log("Bot loaded!");
    bot.sortReplies();
  },
  function (error, batch_num) {
    console.log("Bot errored!");
    console.log(error);
  }
);

function styleReply(reply) {
  return '<div style="font-family: ROBOT; font-size: medium; color: #F4FBD5">' + reply + '</div>';
}

function botReply(user, question, cb) {
  try {
    var reply = bot.reply(user, user.replace(' ', '_') + ' ' + question);
    if (reply != 'ERR: No Reply Matched') {
      if (reply.indexOf('###') > 0) {
        var command = reply.split('###');
        switch (command[0]) {
          case 'Google':
            googleSearch(command[1], cb);
            break;
          case 'WeatherNow':
            weatherData(command[1], 'now', cb);
            break;
          case 'Movie':
            movieData(command[1], command[2], cb);
            break;
          default:
            cb(styleReply(command[0] + command[1]));
            break;
        }
      }
      else {
        cb(styleReply(reply));
      }
    }
  }
  catch (err) {
    cb(styleReply('Sorry! I may have goofed up.<br /><br />Error: ' + err));
  }
}

function googleSearch(query, cb) {
  cb(styleReply('OK. Googling for: ' + query));
  https.get('https://www.googleapis.com/customsearch/v1?cx=005026335174976688145%3A_mkgntfmfgg&key=AIzaSyC8mDlqfkNKmX9go6_5WgRpRQ2bifiTqOM&q=' + query,
    function (res) {
      console.log(res);
      var body = '';
      res.on('data', function (d) {
        body += d;
      });
      res.on('end', function () {
        // Data reception is done, do whatever with it!
        var data = JSON.parse(body);
        let searchResHTML = 'Here are the search results:<br /><br /><ol style="padding-left: 15px; line-height: 1.5">';
        for (let i = 0; i < data.items.length; i++) {
          searchResHTML += '<li><a target="_blank" style="color: #fff" href="' + data.items[i].link + '">' + data.items[i].title + '</a></li>';
        }
        searchResHTML += '</ol>';
        cb(styleReply(searchResHTML));
      });
    });
}


function weatherData(city, timeSpan, cb) {
  cb(styleReply('OK. Getting weather data'));
  http.get('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=798a73bf6df2e2e5e14e024b37f639a0&units=metric',
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

        searchResHTML += '<img src="http://openweathermap.org/img/w/' + weather.icon + '.png" /><br />'
        searchResHTML += 'Location: ' + data.name + '<br />';
        searchResHTML += 'Temperature: ' + data.main.temp + '&deg;C<br />';
        searchResHTML += 'Cloud Cover: ' + data.clouds.all + '%<br />';

        cb(styleReply(searchResHTML));
      });
    });
}


function movieData(mode, searchTerm, cb) {
  cb(styleReply('OK. Getting movie information'));
  switch (mode) {
    case 'now_playing':
      https.get('https://api.themoviedb.org/3/movie/now_playing?api_key=715cc933f7a7c58610d3ae41cac87ae2', function (res) {
        var movieData = getMovieDataHTML(res, cb);
      });
      break;
    case 'good':
      https.get('https://api.themoviedb.org/3/movie/top_rated?api_key=715cc933f7a7c58610d3ae41cac87ae2', function (res) {
        var movieData = getMovieDataHTML(res, cb);
      });
      break;
    case 'search':
      https.get('https://api.themoviedb.org/3/search/movie?query=' + searchTerm + '&api_key=715cc933f7a7c58610d3ae41cac87ae2', function (res) {
        var movieData = getMovieDataHTML(res, cb);
      });
      break;
  }
}

function getMovieDataHTML(res, cb) {
  var body = '';
  res.on('data', function (d) {
    body += d;
  });

  res.on('end', function () {
    // Data reception is done, do whatever with it!
    var data = JSON.parse(body);
    let searchResHTML = '';

    searchResHTML += '<table><tbody>';
    searchResHTML += data.results.splice(0, 5).map(function (movie) {
      return '<tr>' +
        '<td><img src="http://image.tmdb.org/t/p/w300' + movie.poster_path + '" height="100px;" /></td>' +
        '<td width="200px">' + movie.title + '<br /><span style="color: blue;">' + movie.vote_average + '</span></td>' +
        '<td>' + movie.overview + '</td>' +
        '</tr>';
    }).join('');
    searchResHTML += '</tbody></table>';

    cb(styleReply(searchResHTML));
  });
}

module.exports = botReply;