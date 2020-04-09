import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task, auth } from '../actions';
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
        this.state = {
            company_users: [],
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

    getItems = () => {
        const { company_users} = this.state;
        const { user, current_company_id } = this.props;

        let items = [];

        const current_company = user.companies.find(company => company.company_id == current_company_id);

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

    render () {
        return (
            <div className="employees">
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
        logout: () => dispatch(auth.logout()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCard);
