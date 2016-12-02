import RiveScript from 'rivescript';
import test from 'ava';

function makeBot(callback) {
    const bot = new RiveScript();

    bot.loadFile('server/bot.rive',
        () => {
            // eslint-disable-next-line no-console
            // console.log(`Bot loaded! Batch No: ${batch_num}`);
            bot.sortReplies();
            callback(null, bot);
        },
        (error) => {
            callback(error, null);
        }
    );
}

function botReply(bot, question) {
    return bot.reply('username', 'username'.replace(' ', '_') + ' ' + question);
}

test.cb('bot loads.', t => {
    makeBot((err, bot) => {
        t.falsy(err);
        t.truthy(bot);
        t.end();
    });
});

test.cb('bot can say hi.', t => {
    makeBot((err, bot) => {
        t.falsy(err);
        var reply = botReply(bot, 'hi bot');
        t.true(reply.indexOf('How may I assist you') > -1);
        t.end();
    });
});

test.cb('bot says sorry.', t => {
    makeBot((err, bot) => {
        t.falsy(err);
        t.true(botReply(bot, 'bad bot').indexOf('I\'m Sorry') > -1);
        t.true(botReply(bot, 'this bot is soo stupid').indexOf('I\'m Sorry') > -1);
        t.true(botReply(bot, 'this bot is such an idiot').indexOf('I\'m Sorry') > -1);
        t.end();
    });
});

test.cb('bot can search.', t => {
    makeBot((err, bot) => {
        t.falsy(err);
        t.true(botReply(bot, 'google something').indexOf('search###something') > -1);
        t.true(botReply(bot, 'hey bot could you google for something').indexOf('search###something') > -1);
        t.end();
    });
});

test.cb('bot can get current weather.', t => {
    makeBot((err, bot) => {
        t.falsy(err);
        t.true(botReply(bot, 'bot weather').indexOf('weather###current###Bangalore') > -1);
        t.true(botReply(bot, 'weather outside') == 'weather###current###Bangalore');
        t.true(botReply(bot, 'weather in bangalore') == 'weather###current###bangalore');
        t.end();
    });
});

test.cb('bot can get forcasted weather.', t => {
    makeBot((err, bot) => {
        t.falsy(err);
        t.true(botReply(bot, 'bot what is the weather forcast') == 'weather###forcast###Bangalore');
        t.true(botReply(bot, 'how is the weather forcast like in london') == 'weather###forcast###london');
        t.end();
    });
});