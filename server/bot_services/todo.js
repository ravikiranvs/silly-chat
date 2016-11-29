class TodoService {
  constructor() {
    this.userName = 'silly.chat.bot';
    this.password = 'nothingtosee';

    this.rtmMail = 'ravikiranvs+6829a0@rmilk.com';
    this.rtmInboxUrl = 'https://www.rememberthemilk.com/home/ravikiranvs/';
  }

  addTask(task, callback) {
    callback(`OK. Adding task <u>${task}</u> to Remember The Milk`);
    var nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport 
    var transporter = nodemailer.createTransport(`smtps://${this.userName}%40gmail.com:${this.password}@smtp.gmail.com`);

    // setup e-mail data with unicode symbols 
    var mailOptions = {
      from: `"silly-chat" <${this.userName}@gmail.com>`, // sender address 
      to: this.rtmMail, // list of receivers 
      subject: task, // Subject line 
      text: task, // plaintext body 
      html: '<b>' + task + '</b>' // html body 
    };

    // send mail with defined transport object 
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        callback(`:( I Goofed up: ${error} ${info}`);
      } else {
        callback(`Task added: see <a target="_blank" href="${this.rtmInboxUrl}">Inbox</a>`);
      }
    });
  }

  serve(callback, question, [task]) {
    this.addTask(task, callback);
  }
}

export default TodoService;