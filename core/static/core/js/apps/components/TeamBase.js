import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task } from '../actions';
import AddTask from './AddTask';
import TaskList from './TaskList';
import UserProfile from './UserProfile';
import TaskDetail from './TaskDetail';
import CompanyCard from './CompanyCard';
import { Redirect } from "react-router-dom";
import { Icon, Image, Menu, Segment, Sidebar, Button, Dimmer, Loader, Dropdown } from 'semantic-ui-react';
import { showErrorMessage, errorMessageToString } from '../utils';


class TeamBase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            component: TaskList,
        };
    }

    handleChange = (e, { value }) => {
        const { token } = this.props;
        let headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let body = JSON.stringify({current_company_id: value});

        return fetch("/api/change_current_company/", {headers, body, method: "POST"})
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
                    if (res.data.success) {
                        this.setState({current_company_id: value});
                        location.href = location.href;
                    } else {
                        showErrorMessage('Ошибка', errorMessageToString(res.data.message));
                    }
                } else if (res.status === 403 || res.status === 401) {
                    showErrorMessage('Ошибка', errorMessageToString(''));
                } else {
                    showErrorMessage('Ошибка', errorMessageToString(''));
                }
            })
    }

    getOptions = () => {
        const { user } = this.props;
        const companies = user.companies || [];
        let options = [];
        for (let company of companies ) {
            options.push({
                key: company.company_id,
                text: company.company_name,
                value: company.company_id,
            });
        }
        return options;
    }

    CurrentComponent = ({component: ChildComponent}) => {
        return <ChildComponent />
    }

    getCurrentCompanyName = () => {
        const { user, current_company_id } = this.props;
        let name = '';

        if (user.companies) {
            name = user.companies.find(company => company.company_id == current_company_id).company_name;
        }
        return name;
    }

    render() {
        const {
            isAuthenticated, addTaskShowModal, addTaskHideModal, showModalAddTask, addTask, user, descriptionMode,
            getTasksToExecute, isLoading, createComment, task, toggleDescriptionMode, saveDescription,
            current_company_id,
        } = this.props;
        const { component } = this.state;
        let { CurrentComponent } = this;

        if (!isAuthenticated) {
            return <Redirect to="/login" />
        }
        const current_company_name = this.getCurrentCompanyName();

        return (
            <div>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        icon='labeled'
                        inverted
                        vertical
                        visible
                        width='thin'
                        style={{ width: '170px' }}
                    >
                        <Menu.Item as='a'>
                            <span style={{ fontSize: '18px'}}>
                                {user.name}
                                <Icon
                                    name='setting'
                                    className='icon-profile'
                                    title='Настройки'
                                    onClick={() => this.setState({component: UserProfile})}
                                />
                            </span>
                        </Menu.Item>
                        <Menu.Item style={{ minHeight: '110px' }}>
                            <div style={{ marginBottom: '10px' }}>Текущая компания</div>
                            <Dropdown
                                onChange={this.handleChange}
                                options={this.getOptions()}
                                placeholder='Choose an option'
                                selection
                                value={current_company_id}
                                style={{ width: '150px', minWidth: '100px' }}
                            />
                        </Menu.Item>
                        <Menu.Item as='a'>
                            <AddTask
                                addTaskShowModal={addTaskShowModal}
                                addTaskHideModal={addTaskHideModal}
                                showModalAddTask={showModalAddTask}
                                addTask={addTask}
                            />
                        </Menu.Item>
                        <Menu.Item as='a'>
                            <Button onClick={() => this.setState({ component: TaskList })}>
                                Мои задачи
                            </Button>
                        </Menu.Item>
                        { current_company_name &&
                            <Menu.Item as='a'>
                                <Button onClick={() => this.setState({ component: CompanyCard })}>
                                    { current_company_name }
                                </Button>
                            </Menu.Item>
                        }
                        { user.is_superuser &&
                            <Menu.Item as='a'>
                                <a href='/admin/'>Администрирование</a>
                            </Menu.Item>
                        }
                    </Sidebar>

                    <Sidebar.Pusher>
                        <Segment basic style={{ minHeight: '100vh', marginLeft: '170px' }}>
                            <div class='row'>
                                <div className='col-sm-6'>
                                    <CurrentComponent component={component} />
                                </div>
                                {component == TaskList &&
                                    <TaskDetail
                                        task={task}
                                        createComment={createComment}
                                        descriptionMode={descriptionMode}
                                        toggleDescriptionMode={toggleDescriptionMode}
                                        saveDescription={saveDescription}
                                    />
                                }
                            </div>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isLoading: state.nemo.isLoading,
        user: state.auth.user,
        task: state.nemo.task,
        showModalAddTask: state.nemo.showModalAddTask,
        descriptionMode: state.nemo.descriptionMode,
        current_company_id: state.auth.current_company_id,
        token: state.auth.token,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addTaskShowModal: () => dispatch(task.addTaskShowModal()),
        addTaskHideModal: () => dispatch(task.addTaskHideModal()),
        addTask: (data) => dispatch(task.addTask(data)),
        createComment: (text, task_id) => dispatch(task.createComment(text, task_id)),
        getTasksToExecute: () => dispatch(task.getTasksToExecute()),
        toggleDescriptionMode: () => dispatch(task.toggleDescriptionMode()),
        saveDescription: (description, task_id) => dispatch(task.saveDescription(description, task_id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamBase);