import './header.css';
import React, {PropTypes} from 'react';

class Header extends React.Component {
  constructor(props, context) {
    super(props);

    context.socket.on('users', this.onUsersChange.bind(this));
    this.state = { users: [] };
  }

  onUsersChange(userDict) {
    const name = this.context.config.getName();
    if (userDict[this.context.socket.id] != this.context.config.getName())
      this.context.socket.emit('users', name);
    else {
      const users = Object.keys(userDict).map((key) => {
        return { id: key, name: userDict[key] };
      });

      this.setState({ users });
    }
  }

  render() {
    return (
      <div className="main-header">
        <a className="side-menu-button fa fa-cog" onClick={this.props.openSettings}></a>
        <ul className="users-list">
          {this.state.users.map(function (user) {
            return <li key={user.id}>{user.name}</li>;
          }) }
        </ul>
      </div>
    );
  }
}

Header.contextTypes = { config: PropTypes.object, socket: PropTypes.object };

Header.propTypes = { openSettings: PropTypes.func };

export default Header;