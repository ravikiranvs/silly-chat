import https from 'https';

class MoviesService {
  constructor() {
    this.apiKey = '715cc933f7a7c58610d3ae41cac87ae2';
  }

  createHtmlFromResponse(res, callback) {
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

      callback(searchResHTML);
    });
  }

  nowPlaying(callback) {
    callback('OK. Getting the latest movies');
    https.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${this.apiKey}`, (res) => {
      this.createHtmlFromResponse(res, callback);
    });
  }

  top(callback) {
    callback('OK. Getting the top rated movies');
    https.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${this.apiKey}`, (res) => {
      this.createHtmlFromResponse(res, callback);
    });
  }

  search(searchTerm, callback) {
    callback(`OK. Searching for:${searchTerm}`);
    https.get(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=${this.apiKey}`, (res) => {
      this.createHtmlFromResponse(res, callback);
    });
  }

  serve(callback, question, [type, searchTerm]) {
    if (type === 'now_playing') {
      this.nowPlaying(callback);
    } else if (type === 'top') {
      this.top(callback);
    } else if (type === 'search') {
      this.search(searchTerm, callback);
    }
  }

}

export default MoviesService;