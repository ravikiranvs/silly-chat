import RiveScript from 'rivescript';
import SearchService from './bot_services/search';
import WeatherService from './bot_services/weather';
import MoviesService from './bot_services/movies';
import TodoService from './bot_services/todo';

class SillyChatBot {
  // Initializes the bot from rive script
  constructor() {
    const bot = new RiveScript();

    bot.loadFile('server/bot.rive',
      (batch_num) => {
        // eslint-disable-next-line no-console
        // console.log(`Bot loaded! Batch No: ${batch_num}`);
        bot.sortReplies();
      },
      (error, batch_num) => {
        // eslint-disable-next-line no-console
        console.error(`Bot errored! Batch No: ${batch_num}`);
        // eslint-disable-next-line no-console
        console.error(error);
      }
    );

    this.bot = bot;

    this.registeredServices = [
      {
        name: 'search',
        provider: new SearchService()
      },
      {
        name: 'weather',
        provider: new WeatherService()
      },
      {
        name: 'movie',
        provider: new MoviesService()
      },
      {
        name: 'todo',
        provider: new TodoService()
      }
    ];
  }

  // Apply Bot Style for Html
  styleReply(reply) {
    return '<div style="font-family: ROBOT; font-size: medium; color: #F4FBD5">' + reply + '</div>';
  }

  botReply(user, question, cb) {
    // Use bot style for all replies 
    const styledCallback = (reply) => cb(this.styleReply(reply));

    try {
      const reply = this.bot.reply(user, user.replace(' ', '_') + ' ' + question);

      if (reply != 'ERR: No Reply Matched') {
        if (reply.indexOf('###') > 0) {
          let command = reply.split('###');
          const servicesForQuestion = this.registeredServices.filter((service) => service.name === command[0]);

          if (servicesForQuestion.length === 0) {
            styledCallback('I don\'t know how to do this yet :(');
          } else {
            servicesForQuestion.forEach((service) => {
              command.splice(0, 1);
              service.provider.serve(styledCallback, question, command);
            });
          }
        }
        else {
          styledCallback(reply);
        }
      }
    }
    catch (err) {
      styledCallback('Sorry! I may have goofed up.<br /><br />Error: ' + err + err.stack);
      //console.log(err.stack);
    }
  }
}

export default SillyChatBot;