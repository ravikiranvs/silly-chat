import test from 'ava';
import LinkMiddleware from './link';
import helper from '../bot_services/service-test-helper';

test.cb('no responce if no url in question.', t => {
    var linkMd = new LinkMiddleware();
    var callbackCalled = false;
    linkMd.serve(() => {
        callbackCalled = true;
    }, 'test. no url here.');
    setTimeout(() => {
        t.false(callbackCalled);
        t.end();
    }, 50);
});

test.cb('gets a responce if url in question.', t => {
    var linkMd = new LinkMiddleware();
    var callbackCalled = 0;
    linkMd.serve((resp) => {
        callbackCalled++;
        if (callbackCalled == 1)
            t.true(resp == 'I found a URL! Let me create a link for it.');
        else {
            var respObj = helper.createJqueryObjFromHtmlSnippet(resp);
            t.true(respObj.find('a').length == 1);
        }
    }, 'test. https://silly-chat.herokuapp.com url here.');
    setTimeout(() => {
        t.true(callbackCalled > 0);
        t.end();
    }, 50);
});

test.cb('responce contains same links as the questions in the url.', t => {
    var linkMd = new LinkMiddleware();
    var callbackCalled = 0;
    linkMd.serve((resp) => {
        callbackCalled++;
        if (callbackCalled == 1)
            t.true(resp == 'I found URLs! Let me create links for them.');
        else {
            var respObj = helper.createJqueryObjFromHtmlSnippet(resp);
            t.true(respObj.find('a').length == 2);
        }
    }, 'test. https://silly-chat.herokuapp.com url here. and another https://silly-chat2.herokuapp.com');
    setTimeout(() => {
        t.true(callbackCalled > 0);
        t.end();
    }, 50);
});