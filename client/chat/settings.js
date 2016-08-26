import './settings.css';
import React, {PropTypes} from 'react';

class Settings extends React.Component {
  constructor(props, context){
    super(props);

    this.state = { name: context.config.getName(), notification: context.config.getDisplayNotification() };
    this.saveSettings = this.saveSettings.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onNotificationChange = this.onNotificationChange.bind(this);
  }

  saveSettings(){
    this.context.config.setName(this.state.name);
    this.context.config.setDisplayNotification(this.state.notification);

    this.props.close();
  }

  onNameChange(event){
    event.preventDefault();
    this.setState({name: event.target.value});
  }

  onNotificationChange(event) {
    event.preventDefault();
    this.setState({notification: !this.state.notification});
  }

  render() {
    const settingsClass = this.props.isVisible ? 'settings showSideNav' : 'settings';

    return (
      <div className={settingsClass}>
        <div className="header">
          <a className="fa fa-times settings-close" onClick={this.props.close}></a>
        </div>
        <div style={{padding: '10px'}}>
          Name<input className="settingsName" onChange={this.onNameChange} value={this.state.name}></input>
        </div>
        <div style={{padding: '10px', display: 'inline-flex'}}>
          Notification
          <div className="notificationSetting">
            <input type="checkbox" checked={this.state.notification} className="settingsNotification" name="check" />
            <label htmlFor="settingsNotification" onClick={this.onNotificationChange}></label>
          </div>
        </div>
        <div style={{padding: '10px'}}>
          <button className="settingsSave" onClick={this.saveSettings}>OK</button>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  isVisible: PropTypes.bool,
  close: PropTypes.func
};

Settings.contextTypes = {
  config: PropTypes.object
};

export default Settings;