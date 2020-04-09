import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task, auth } from '../actions';
import { Button, Image, List, Modal, Icon } from 'semantic-ui-react';
import {getUserOptions} from '../utils';


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

    getItems = () => {
        const { company_users} = this.state;

        let items = [];

        items.push(
            <List.Item>
                <Button
                    onClick={() => console.log('welcome')}
                    style={{ marginBottom: '15px' }}
                    content='Пригласить пользователей'
                    labelPosition='left'
                    icon='edit'
                    primary
                />
            </List.Item>
        );

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
    };
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(auth.logout()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCard);
