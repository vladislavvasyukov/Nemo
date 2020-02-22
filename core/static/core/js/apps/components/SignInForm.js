import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../actions';
import { Redirect } from "react-router-dom";
import Menu from './Menu';


class SignInForm extends Component {

    state = {
        username: "",
        password: "",
    }


    onLogin = (event) => {
        event.preventDefault();
        this.props.login(this.state.username, this.state.password);
    }

    render() {

        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }

        return (
            <div>
                <Menu />
                <div className="login">
                    <h1>Вход</h1>
                    <form method="post" onSubmit={this.onLogin}>
                        {this.props.errors.length > 0 && (
                            <ul>
                                {this.props.errors.map(error => (
                                    <li key={error.field}>{error.message}</li>
                                ))}
                            </ul>
                        )}
                        <input
                            type="text"
                            name="username"
                            placeholder="Логин"
                            title="Пожалуйста, заполните это поле"
                            required="required"
                            onChange={e => this.setState({username: e.target.value})}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            title="Пожалуйста, заполните это поле"
                            required="required"
                            onChange={e => this.setState({password: e.target.value})}
                        />
                      <button type="submit" className="btn btn-primary btn-block btn-large">Войти</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    let errors = [];
    if (state.auth.errors) {
        errors = Object.keys(state.auth.errors).map(field => {
            return {field, message: state.auth.errors[field]};
        });
    }
    return {
        errors,
        isAuthenticated: state.auth.isAuthenticated
    };
}

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => { return dispatch(auth.login(username, password)); },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
