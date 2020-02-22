import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../actions';
import { Redirect } from "react-router-dom";
import Menu from './Menu';

class SignUpForm extends Component {

    state = {
        username: "",
        password: "",
        email: "",
    }

    onRegister = (event) => {
        event.preventDefault();
        this.props.register(this.state.username, this.state.email, this.state.password);
    }

    render() {

        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }

        return (
            <div>
                <Menu />
                <div className="signup">
                    <h1>Регистрация</h1>
                    <form method="post">
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
                            placeholder="Никнейм"
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
                        <input
                            type="email"
                            name="email"
                            placeholder="e-mail"
                            title="Пожалуйста, заполните это поле"
                            required="required"
                            onChange={e => this.setState({email: e.target.value})}
                        />
                        <button 
                            type="submit" 
                            onClick={this.onRegister} 
                            className="btn btn-primary btn-block btn-large"
                        >
                            Зарегистрироваться
                        </button>
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
        register: (username, email, password) => dispatch(auth.register(username, email, password))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
