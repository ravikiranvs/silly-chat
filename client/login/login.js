import './login.css';
import React, { PropTypes } from 'react';

class Login extends React.Component {
    constructor(props, context) {
        super(props);

        this.state = { name: context.config.getName() };
        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    onChange(event) {
        this.setState({ name: event.target.value });
    }

    onKeyUp(event) {
        if (event.keyCode == 13 && this.state.name != '') {
            this.context.config.setName(this.state.name);
            this.props.login();
        }
    }

    render() {
        return (
            <div className="login">
                <input value={this.state.name || ''} onChange={this.onChange} onKeyUp={this.onKeyUp} placeholder="Name" />
            </div>
        );
    }
}

Login.propTypes = { login: PropTypes.func };

Login.contextTypes = { config: PropTypes.object };

export default Login;