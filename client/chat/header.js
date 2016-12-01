import './header.css';
import React, { PropTypes } from 'react';

class SlidingTimeKeeper {
    constructor(invalidationCallback) {
        this._cache = [];
        this._invalidationTime = 2000;
        this._invalidationCallback = invalidationCallback;

        this.timeOutCallback = this.timeOutCallback.bind(this);
    }

    add(user) {
        const time = new Date().getTime();
        this._cache[user] = time;

        setTimeout(() => { this.timeOutCallback(user, time); }, this._invalidationTime);
    }

    timeOutCallback(user, time) {
        if (this._cache[user] == time) {
            this._invalidationCallback(user);
        }
    }
}

class Header extends React.Component {
    constructor(props, context) {
        super(props);

        this.slidingTimeKeeper = new SlidingTimeKeeper(this.onIsTypingOver.bind(this));

        context.socket.on('users', this.onUsersChange.bind(this));
        context.socket.on('chat isTyping', this.onIsTyping.bind(this));
        this.state = { users: [] };
    }

    onIsTyping(id) {
        this.slidingTimeKeeper.add(id);

        let users = [...this.state.users];
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                users[i].isTyping = true;
                this.setState({ users });
            }
        }
    }

    onIsTypingOver(id) {
        let users = [...this.state.users];
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                users[i].isTyping = false;
                this.setState({ users });
            }
        }
    }

    onUsersChange(userDict) {
        const name = this.context.config.getName();
        if (userDict[this.context.socket.id] != this.context.config.getName())
            this.context.socket.emit('users', name);
        else {
            const users = Object.keys(userDict).map((key) => {
                return { id: key, name: userDict[key], isTyping: false };
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
                        const isTypingClass = user.isTyping ? 'typing' : '';
                        return <li key={user.id} className={isTypingClass}>{user.name}</li>;
                    })}
                </ul>
            </div>
        );
    }
}

Header.contextTypes = { config: PropTypes.object, socket: PropTypes.object };

Header.propTypes = { openSettings: PropTypes.func };

export default Header;