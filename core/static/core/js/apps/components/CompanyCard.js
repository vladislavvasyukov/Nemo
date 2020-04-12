import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task } from '../actions';
import { Button, Image, List, Modal, Icon } from 'semantic-ui-react';
import swal from 'sweetalert2';
import {swalRequest} from '../utils';


class ModalUserCard extends Component {

    render() {
        const { user } = this.props;

        const trigger = (
            <List.Item className='company-user'>
                <Image avatar src={user.avatar_url} style={{ width: '5em', height: '5em' }}/>
                <List.Content style={{ fontSize: '18px', marginBottom: '10px' }}>
                    { user.name }
                </List.Content>
            </List.Item>
        )

        return (
            <Modal trigger={trigger} style={{position: 'relative', margin: 'relative', width: '30%', height: '300px'}}>
                <Modal.Header>{user.name}</Modal.Header>
                <Modal.Content image>
                    <Image wrapped size='medium' src={user.avatar_url} style={{ width: '250px'}}/>
                    <Modal.Description className='user-contacts'>
                        <p><Icon name='mail' title='e-mail' />Email: {user.email}</p>
                        <p><Icon name='skype' title='skype' />Skype: {user.skype}</p>
                        <p><Icon name='telegram' title='telegram' />Telegram: {user.telegram}</p>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        )
    }
}


class CompanyCard extends Component {
    constructor(props) {
        super(props);

        const current_company = this.getCurrentCompany();
        this.state = {
            company_users: [],
            current_company: current_company,
            name: current_company.company_name,
            edit_name: false,
        }
    }

    componentDidMount() {
        let headers = {
            "Content-Type": "application/json",
        };
        const { token } = this.props;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        return fetch('/api/get_company_users/', {headers})
            .then((response) => {
                return response.json()
            }).then((company_users) => {
                this.setState({company_users});
            });
    }

    onInviteUser = () => {
        const { token, user, current_company_id } = this.props;
        swalRequest(
            'Введите email пользователя',
            'email',
            'Пригласить',
            "/api/invite_user/",
            'email',
            user,
            token,
            (() => console.log()),
        )
    }

    getCurrentCompany = () => {
        return this.props.user.companies.find(company => company.company_id == this.props.current_company_id)
    }

    getItems = () => {
        const { company_users, current_company } = this.state;
        const { user, current_company_id } = this.props;

        let items = [];

        if (current_company.is_admin) {
            items.push(
                <List.Item>
                    <Button
                        onClick={this.onInviteUser}
                        style={{ marginBottom: '15px' }}
                        content='Пригласить пользователей'
                        labelPosition='left'
                        icon='edit'
                        primary
                    />
                </List.Item>
            );
        }

        company_users.forEach((user) => {
            items.push(<ModalUserCard user={user} />)
        });

        return items;
    }

    onSave = () => {
        const { edit_name } = this.state;
        this.setState({edit_name: !edit_name});
        this.props.saveCompanyName(this.state.name);
    }

    render () {
        const { edit_name, name } = this.state;

        return (
            <div className="employees">
                <div className='toggle-content_title'>
                    {edit_name ? <div className='toggle-content_title-input'>
                        <input
                            type='text'
                            className='textinput textInput form-control'
                            value={name}
                            onChange={(e) => this.setState({name: e.target.value})}
                            onBlur={this.onSave}
                        />
                        </div>
                        :
                        <div>
                            <span style={{ fontSize: '18px', weight: 'bold' }}>{name}&nbsp;&nbsp;</span>
                            <Icon
                                style={{ cursor: 'pointer' }}
                                name='edit'
                                title='Редактировать'
                                onClick={() => this.setState({edit_name: !edit_name})}
                            />
                        </div>
                    }
                    <div/>
                </div>
                <h2>Сотрудники компании</h2>
                <List divided verticalAlign='middle'>
                    {this.getItems().map(item => item)}
                </List>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        user: state.auth.user,
        current_company_id: state.auth.current_company_id,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        saveCompanyName: (name) => dispatch(task.saveCompanyName(name)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCard);
