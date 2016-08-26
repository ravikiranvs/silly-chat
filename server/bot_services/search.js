import https from 'https';

class GoogleService {
  search(query, callback) {
    callback('OK. Googling for: ' + query);
    https.get('https://www.googleapis.com/customsearch/v1?cx=005026335174976688145%3A_mkgntfmfgg&key=AIzaSyC8mDlqfkNKmX9go6_5WgRpRQ2bifiTqOM&q=' + query,
      function (res) {
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
          callback(searchResHTML);
        });
      });
  }

  serve(callback, question, [query]) {
    this.search(query, callback);
  }
}

export default GoogleService;