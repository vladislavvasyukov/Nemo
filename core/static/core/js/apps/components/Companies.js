import React from 'react';
import { connect } from 'react-redux';
import { Button, List, Icon } from 'semantic-ui-react';
import swal from 'sweetalert2';
import { task } from '../actions';
import { errorMessageToString } from '../utils';


class Companies extends React.Component {

    onCreateCompany = () => {
        const { token, user } = this.props;

        swal.fire({
            title: 'Введите название компании',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Добавить',
            cancelButtonText: 'Отмена',
            showLoaderOnConfirm: true,
            preConfirm: (name) => {
                let headers = {
                    "Content-Type": "application/json",
                };

                if (token) {
                    headers["Authorization"] = `Token ${token}`;
                }
                let body = JSON.stringify({name: name, creator_id: user.pk});

                return fetch("/api/create_company/", {headers, body, method: "POST" })
                    .then(res => {
                        if (res.status < 500) {
                            return res.json().then(data => {
                                return {status: res.status, data};
                            })
                        } else {
                            swal.showValidationMessage('Ошибка');
                        }
                    })
                    .then(res => {
                        if (res.status === 200) {
                            if (res.data.success) {
                                location.href = location.href;
                            } else {
                                swal.showValidationMessage(`Ошибка: ${errorMessageToString(res.data.message)}`);
                            }
                        } else {
                            swal.showValidationMessage('Ошибка');
                        }
                    })
                    .catch(error => {
                        swal.showValidationMessage(`Ошибка: ${error}`);
                    })
            },
            allowOutsideClick: () => !swal.isLoading()
        })
    }

    getItems = () => {
        const { user} = this.props;

        let items = [];
        user.companies.forEach((company) => {
            items.push(
                <List.Item>
                    <List.Content floated='right'>
                        <Icon
                            style={{ cursor: 'pointer' }}
                            name='delete'
                            title='Выйти из компании'
                            onClick={() => this.props.leaveCompany(company.company_id)}
                        />
                    </List.Content>
                    <List.Content style={{ fontSize: '18px', marginBottom: '10px' }}>
                        { company.company_name }
                    </List.Content>
                </List.Item>
            )
        });

        items.push(
            <List.Item>
                <Button
                    onClick={this.onCreateCompany}
                    style={{ marginTop: '15px' }}
                    content='Добавить компанию'
                    labelPosition='left'
                    icon='edit'
                    primary
                />
            </List.Item>
        );

        return items;
    }

    render() {
        const { user } = this.props;

        return (
            <div className="companies">
                <h2>Компании</h2>
                <List divided verticalAlign='middle'>
                    {this.getItems().map(item => item)}
                </List>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        token: state.auth.token,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        leaveCompany: (company_id) => dispatch(task.leaveCompany(company_id))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
