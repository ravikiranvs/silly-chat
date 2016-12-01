class LinkMiddleware {
    serve(callback, question) {
        const urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
        const urls = question.match(urlRegex);
        if (urls) {
            if (urls.length > 1) {
                callback('I found URLs! Let me create links for them.');
                const liArray = urls.map((url) => `<li><a href="${url} target="_blank">${url}</a></li>`);
                callback('<ul>' + liArray.join('') + '</ul>');
            }
            if (urls.length == 1) {
                callback('I found a URL! Let me create a link for it.');
                const liArray = urls.map((url) => `<li><a href="${url} target="_blank">${url}</a></li>`);
                callback('<ul>' + liArray.join('') + '</ul>');
            }
        }
    }
}

export default LinkMiddleware;