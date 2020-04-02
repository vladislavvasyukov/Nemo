import React, { Component } from 'react';
import {FormGroup, Form} from 'react-bootstrap';
import Menu from './Menu';
import { showErrorMessage, errorMessageToString } from '../utils';


export default class RecoverPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            success: false,
        }
    }

    onRecover = (e) => {
        e.preventDefault();

        let headers = {"Content-Type": "application/json"};
        let body = JSON.stringify({email: this.state.email});

        return fetch("/api/recover_password/", {headers, body, method: "POST"})
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                } else {
                    showErrorMessage('Ошибка', errorMessageToString(''));
                }
            })
            .then(res => {
                if (res.status === 200) {
                    console.log(res)
                    if (res.data.success) {
                        this.setState({success: true});
                    } else {
                        showErrorMessage('Ошибка', errorMessageToString(res.data.error));
                    }
                } else if (res.status === 403 || res.status === 401) {
                    showErrorMessage('Ошибка', errorMessageToString(''));
                } else {
                    showErrorMessage('Ошибка', errorMessageToString(''));
                }
            })
    }

    render() {
        return (
            <div>
                <Menu />
                <div className="container">
                    <div className="row justify-content-center">
                        {
                            this.state.success
                            ?
                            <div
                                className="col-xl-4 col-lg-5 col-md-6 col-sm-8 alert alert-success"
                                role="alert"
                                style={{ marginTop: '50px', fontSize: '18px', lineHeight: '1.5' }}
                            >
                                На указанный почтовый ящик отправлено письмо,
                                содержащее дальнейшие инструкции по восстановлению пароля
                            </div>
                            :
                            <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 card authentication">
                                <Form method="post" onSubmit={this.onRecover}>
                                    <legend>Восстановление</legend>
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
                                    <div className="form-group row mb-0 justify-content-center">
                                        <div className="col-sm-6 pl-sm-1">
                                            <input
                                                type="submit"
                                                className="btn-blue"
                                                id="auth-sbm"
                                                value="Войти"
                                            />
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
