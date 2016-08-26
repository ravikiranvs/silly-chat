import './chat.css';
import Header from './header';
import React, {PropTypes} from 'react';
import Settings from './settings';
import messageFormatter from '../message-formatter';

class Chat extends React.Component {
  constructor(props, context) {
    super();

    this.state = { messages: [], newMessage: '', settingsVisible: false };
    this.showSettings = this.showSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.onNewMessageChange = this.onNewMessageChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onNewMessageKeyUp = this.onNewMessageKeyUp.bind(this);

    context.socket.on('chat message', this.newMessage.bind(this));
  }

  onNewMessageChange(event) {
    event.preventDefault();
    this.setState({ newMessage: event.target.value });
  }

  newMessage(messageJson) {
    const message = JSON.parse(messageJson);
    this.setState({ messages: [...this.state.messages, message] });
  }

  sendMessage() {
    const dNow = new Date();
    const message = {
      user: this.context.socket.id,
      message: this.state.newMessage,
      time: `${dNow.getHours()}: ${dNow.getMinutes()}`
    };
    this.context.socket.emit('chat message', JSON.stringify(message));

    this.setState({ newMessage: '' });
  }

  showSettings() {
    this.setState({ settingsVisible: true });
  }

  closeSettings() {
    this.setState({ settingsVisible: false });
  }

  onNewMessageKeyUp(event){
    if(event.keyCode == 13 && (!(event.ctrlKey || event.shiftKey))){
      this.sendMessage();
    }
  }

  render() {
    return (
      <div className="chat-window">
        <Settings isVisible={this.state.settingsVisible} close={this.closeSettings} />
        <Header openSettings={this.showSettings} />

        <ul className="messages">
          {this.state.messages.map((message, index) => {
            const messageClass = message.user == this.context.socket.id ? 'bubble me' : 'bubble you';
            return (
              <li key={index} className={messageClass}>
                <div dangerouslySetInnerHTML={{__html: `${messageFormatter(message.message)}`}}></div>
                <span className="time-stamp">{message.time}</span>
              </li>
            );
          }) }
        </ul>

        <form className="new-message-form" onSubmit={this.sendMessage}>
          <textarea className="new-message" autoComplete="on" onChange={this.onNewMessageChange} value={this.state.newMessage} onKeyUp={this.onNewMessageKeyUp} />
          <button className="fa fa-paper-plane"></button>
        </form>
      </div>
    );
  }
}

Chat.contextTypes = { socket: PropTypes.object };

export default Chat;