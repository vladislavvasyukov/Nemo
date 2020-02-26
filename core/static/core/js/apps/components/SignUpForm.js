import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../actions';
import { Redirect } from "react-router-dom";
import {FormGroup, Form} from 'react-bootstrap'
import Menu from './Menu';

class SignUpForm extends Component {

    state = {
        name: "",
        email: "",
        password: "",
    }

    onRegister = (event) => {
        event.preventDefault();
        this.props.register(this.state.name, this.state.email, this.state.password);
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
                            <Form method="post" onSubmit={this.onRegister}>
                                <legend>Регистрация пользователя</legend>
                                {this.props.errors.length > 0 && (
                                    <ul>
                                        {this.props.errors.map(error => (
                                            <li key={error.field}>{error.message}</li>
                                        ))}
                                    </ul>
                                )}
                                <FormGroup>
                                    <label className="col-form-label required" for="name">Ваше имя</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        autocomplete="off" 
                                        name="name" 
                                        required="required" 
                                        className="form-control-plaintext"
                                        onChange={e => this.setState({name: e.target.value})} />
                                </FormGroup>
                                <FormGroup>
                                    <label className="col-form-label required" for="email">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        autocomplete="off" 
                                        name="email" 
                                        required="required" 
                                        className="form-control-plaintext"
                                        onChange={e => this.setState({email: e.target.value})}/>
                                </FormGroup>
                                <FormGroup>
                                    <label className="col-form-label required" for="register_plainPassword1">
                                        Пароль
                                    </label>
                                    <input 
                                        type="password" 
                                        autocomplete="off" 
                                        id="register_plainPassword1" 
                                        name="password" 
                                        required="required" 
                                        className="form-control-plaintext"
                                        onChange={e => this.setState({password: e.target.value})} />
                                </FormGroup>
                                <FormGroup>
                                    <label className="col-form-label required" for="register_plainPassword2">
                                        Повтор пароля
                                    </label>
                                    <input 
                                        type="password" 
                                        autocomplete="off" 
                                        id="register_plainPassword2" 
                                        name="password2" 
                                        required="required" 
                                        className="form-control-plaintext" />
                                </FormGroup>
                                <FormGroup>
                                    <label class="col-form-label" for="register_registrationData_skype">Skype</label>
                                    <input 
                                        type="text" 
                                        id="register_registrationData_skype" 
                                        name="skype" 
                                        className="form-control-plaintext skype" />
                                </FormGroup>
                                <FormGroup>
                                    <label className="col-form-label" for="register_registrationData_telegram">
                                        Telegram
                                    </label>
                                    <input 
                                        type="text" 
                                        id="register_registrationData_telegram" 
                                        name="telegram" 
                                        className="form-control-plaintext telegram" />
                                </FormGroup>
                                <div className="form-group row mb-0 justify-content-center">
                                    <div className="col-sm-6 pl-sm-1">
                                        <input type="submit" className="btn-blue" value="Регистрация" />
                                    </div>
                                </div>
                            </Form>
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
        register: (name, email, password) => dispatch(auth.register(name, email, password))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
