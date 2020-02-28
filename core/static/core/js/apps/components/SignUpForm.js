import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../actions';
import { Redirect } from "react-router-dom";
import {FormGroup, Form} from 'react-bootstrap'
import Menu from './Menu';
import { validate } from 'indicative/validator'

class SignUpForm extends Component {

    state = {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        skype: "",
        telegram: "",
    }

    onRegister = (event) => {
        event.preventDefault();

        const data = this.state;
        console.log(data)
        const rules = {
            name: "required|string",
            email: "required|email",
            password: "required|email|min:6|confirmed",
        }
        const messages = {
            required: 'Это поле {{ field }} обязятельно',
            'email.email': 'Невалидный email',
            'password.confirmation': 'Пароли не совпадают',
        }

        validate(data, rules, messages)
            .then(() => {
                this.props.register(
                    this.state.name, this.state.email, this.state.password, this.state.skype, this.state.telegram,
                );
            })
            .catch(errors => {
                console.log(errors)
        })
    }

    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
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
                        <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 card authentication">
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
                                        className="form-control"
                                        onChange={this.handleInputChange} />
                                </FormGroup>
                                <FormGroup>
                                    <label className="col-form-label required" for="email">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        autocomplete="off" 
                                        name="email" 
                                        required="required" 
                                        className="form-control"
                                        onChange={this.handleInputChange}/>
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
                                        className="form-control"
                                        onChange={this.handleInputChange} />
                                </FormGroup>
                                <FormGroup>
                                    <label className="col-form-label required" for="register_plainPassword2">
                                        Повтор пароля
                                    </label>
                                    <input 
                                        type="password" 
                                        autocomplete="off" 
                                        id="register_plainPassword2" 
                                        name="password_confirmation"
                                        required="required" 
                                        className="form-control"
                                        onChange={this.handleInputChange} />
                                </FormGroup>
                                <FormGroup>
                                    <label class="col-form-label" for="register_registrationData_skype">Skype</label>
                                    <input 
                                        type="text" 
                                        id="register_registrationData_skype" 
                                        name="skype" 
                                        className="form-control skype"
                                        onChange={this.handleInputChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <label className="col-form-label" for="register_registrationData_telegram">
                                        Telegram
                                    </label>
                                    <input 
                                        type="text" 
                                        id="register_registrationData_telegram" 
                                        name="telegram" 
                                        className="form-control telegram"
                                        onChange={this.handleInputChange} />
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
        register: (name, email, password, skype, telegram) => dispatch(
            auth.register(name, email, password, skype, telegram)
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
