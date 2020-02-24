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
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8">
                            <form method="post">
                                <legend>Регистрация</legend>
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
                                <div className="form-group">
                                    <label className="col-form-label required" for="email">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        required="required" 
                                        placeholder="e-mail"
                                        title="Пожалуйста, заполните это поле"
                                        className="form-control-plaintext" 
                                        onChange={e => this.setState({email: e.target.value})}/>
                                </div>
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
