import jQuery from 'jquery';
import jsDom from 'jsdom';

var localDocument = jsDom.jsdom('<html></html>');
var localWindow = localDocument.defaultView;
var $ = jQuery(localWindow);

export default {
    createJqueryObjFromHtmlSnippet: function (html) {
        var localDocument = jsDom.jsdom('<html></html>');
        var localWindow = localDocument.defaultView;
        var $ = jQuery(localWindow);
        return $($.parseHTML(html));
    }
}