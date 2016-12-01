'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    createJqueryObjFromHtmlSnippet: function createJqueryObjFromHtmlSnippet(html) {
        var localDocument = _jsdom2.default.jsdom('<html></html>');
        var localWindow = localDocument.defaultView;
        var $ = (0, _jquery2.default)(localWindow);
        return $($.parseHTML(html));
    }
};