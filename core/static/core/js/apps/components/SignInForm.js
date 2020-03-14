import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../actions';
import {FormGroup, Form} from 'react-bootstrap'
import { Redirect } from "react-router-dom";
import Menu from './Menu';


class SignInForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

    componentWillUnmount() {
        this.props.setErrors({login_errors: []});
    }

    onLogin = (event) => {
        event.preventDefault();
        this.props.login(this.state.email, this.state.password);
    }

    render() {

        if (this.props.isAuthenticated) {
            return <Redirect to="/team" />
        }

        return (
            <div>
                <Menu />
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 card authentication">
                            <Form method="post" onSubmit={this.onLogin}>
                                <legend>Вход</legend>
                                {this.props.login_errors.length > 0 && (
                                    <ul>
                                        {this.props.login_errors.map(error => (
                                            <li key={error.field} className="error">{error.message}</li>
                                        ))}
                                    </ul>
                                )}
                                <FormGroup>
                                    <label className="col-form-label required" for="email">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        required="required" 
                                        placeholder="e-mail"
                                        title="Пожалуйста, заполните это поле"
                                        className="form-control"
                                        onChange={e => this.setState({email: e.target.value})}/>
                                </FormGroup>
                                <FormGroup>
                                    <div className="col-form-label" style={{float: "right"}}>
                                        <a href="/recover">Забыли пароль?</a>
                                    </div>
                                    <label className="col-form-label required" for="password">Пароль</label>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        placeholder="Пароль"
                                        title="Пожалуйста, заполните это поле"
                                        onChange={e => this.setState({password: e.target.value})}
                                        required="required" 
                                        className="form-control" />
                                </FormGroup>
                                <div className="form-group row mb-0 justify-content-center">
                                    <div className="col-sm-6 pl-sm-1">
                                        <input 
                                            type="submit" 
                                            className="btn-blue" 
                                            id="auth-sbm" 
                                            value="Войти" />
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
    let login_errors = [];
    if (state.auth.login_errors) {
        login_errors = Object.keys(state.auth.login_errors).map(field => {
            return {field, message: state.auth.login_errors[field]};
        });
    }
    return {
        login_errors,
        isAuthenticated: state.auth.isAuthenticated
    };
}

const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(auth.login(email, password)),
        setErrors: (errors) => dispatch(auth.setErrors(errors))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
