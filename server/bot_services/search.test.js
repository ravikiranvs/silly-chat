import test from 'ava';
import helper from './service-test-helper';

var mockResults = JSON.stringify({
    items: [
        {
            link: 'http://testresult1.com',
            title: 'testresult1'
        },
        {
            link: 'http://testresult2.com',
            title: 'testresult2'
        }
    ]
});

var nock = require('nock');

nock('https://www.googleapis.com')
    .get('/customsearch/v1?cx=005026335174976688145%3A_mkgntfmfgg&key=AIzaSyC8mDlqfkNKmX9go6_5WgRpRQ2bifiTqOM&q=something')
    .reply(200, mockResults);

require('babel-register')({
    presets: ['es2015']
});

var GoogleService = require('./search').default;


test.cb('Bot can search.', t => {
    var searchService = new GoogleService();
    var callbackCount = 0;
    searchService.serve(function (resp) {
        if (callbackCount == 0) {
            t.true(resp == 'OK. Googling for: something');
            callbackCount++;
        }
        else if (callbackCount == 1) {
            var respJq = helper.createJqueryObjFromHtmlSnippet(resp);
            t.true(respJq.find('li').length == 2);
            t.end();
        }
    }, '', ['something']);
});