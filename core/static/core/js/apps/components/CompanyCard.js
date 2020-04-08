import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task, auth } from '../actions';
import { Button, Image, List } from 'semantic-ui-react';
import {getUserOptions} from '../utils';


class CompanyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company_users: [],
        }
    }

    componentDidMount() {
        this.getCompanyUsers();
    }

    getCompanyUsers() {
        getUserOptions(
            '',
            (company_users) => {
                this.setState({ company_users: company_users });
            },
            false,
        );
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
            items.push(
                <List.Item>
                    <Image avatar src={user.avatar_url} style={{ width: '5em', height: '5em' }}/>
                    <List.Content style={{ fontSize: '18px', marginBottom: '10px' }}>
                        { user.text }
                    </List.Content>
                </List.Item>
            )
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
        current_company_id: state.auth.current_company_id,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(auth.logout()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCard);
