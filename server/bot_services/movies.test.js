import test from 'ava';
import helper from './service-test-helper';

var mockResults = JSON.stringify({
    results: [
        {
            poster_path: 'poster_path1.img',
            title: 'movie1',
            vote_average: 1,
            overview: 'overview1'
        },
        {
            poster_path: 'poster_path2.img',
            title: 'movie2',
            vote_average: 2,
            overview: 'overview2'
        }
    ]
});

var nock = require('nock');

var example = nock('https://api.themoviedb.org')
    .get('/3/movie/now_playing?api_key=715cc933f7a7c58610d3ae41cac87ae2')
    .reply(200, mockResults)
    .get('/3/movie/top_rated?api_key=715cc933f7a7c58610d3ae41cac87ae2')
    .reply(200, mockResults)
    .get('/3/search/movie?query=test&api_key=715cc933f7a7c58610d3ae41cac87ae2')
    .reply(200, mockResults);

require('babel-register')({
    presets: ['es2015']
});

var MoviesService = require('./movies').default;


test.cb('Bot can get latest movies.', t => {
    var movieService = new MoviesService();
    var callbackCount = 0;
    movieService.serve(function (resp) {
        if (callbackCount == 0) {
            t.true(resp == 'OK. Getting the latest movies');
            callbackCount++;
        }
        else if (callbackCount == 1) {
            var respJq = helper.createJqueryObjFromHtmlSnippet(resp);
            t.true(respJq.find('tr').length == 2);
            t.end();
        }
    }, '', ['now_playing', null]);
});

test.cb('Bot can get top rated movies.', t => {
    var movieService = new MoviesService();
    var callbackCount = 0;
    movieService.serve(function (resp) {
        if (callbackCount == 0) {
            t.true(resp == 'OK. Getting the top rated movies');
            callbackCount++;
        }
        else if (callbackCount == 1) {
            var respJq = helper.createJqueryObjFromHtmlSnippet(resp);
            t.true(respJq.find('tr').length == 2);
            t.end();
        }
    }, '', ['top', null]);
});

test.cb('Bot can search for movies.', t => {
    var movieService = new MoviesService();
    var callbackCount = 0;
    movieService.serve(function (resp) {
        if (callbackCount == 0) {
            t.true(resp == 'OK. Searching for: test');
            callbackCount++;
        }
        else if (callbackCount == 1) {
            var respJq = helper.createJqueryObjFromHtmlSnippet(resp);
            t.true(respJq.find('tr').length == 2);
            t.end();
        }
    }, '', ['search', 'test']);
});