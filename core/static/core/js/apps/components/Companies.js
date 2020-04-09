import React from 'react';
import { connect } from 'react-redux';
import { Button, List, Icon } from 'semantic-ui-react';
import swal from 'sweetalert2';
import { task } from '../actions';
import { swalRequest } from '../utils';


class Companies extends React.Component {

    onCreateCompany = () => {
        const { token, user } = this.props;
        swalRequest(
            'Введите название компании',
            'text',
            'Создать',
            "/api/create_company/",
            'name',
            user,
            token,
            (() => location.href = location.href),
        )
    }

    getItems = () => {
        const { user} = this.props;

        let items = [];

        items.push(
            <List.Item>
                <Button
                    onClick={this.onCreateCompany}
                    style={{ marginBottom: '15px' }}
                    content='Добавить компанию'
                    labelPosition='left'
                    icon='edit'
                    primary
                />
            </List.Item>
        );

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

        return items;
    }

    render() {
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
