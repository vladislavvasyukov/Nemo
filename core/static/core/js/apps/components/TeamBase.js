import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task } from '../actions';
import AddTask from './AddTask';
import TaskList from './TaskList';
import UserProfile from './UserProfile';
import { Redirect } from "react-router-dom";
import { Icon, Image, Menu, Segment, Sidebar, Button } from 'semantic-ui-react';


class TeamBase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            component: TaskList,
        };
    }

    CurrentComponent = ({component: ChildComponent}) => {
        return <ChildComponent />
    }

    render() {
        const {
            isAuthenticated, addTaskShowModal, addTaskHideModal, showModalAddTask, addTask, user,
            getTasksToExecute,
        } = this.props;
        let { CurrentComponent } = this;

        if (!isAuthenticated) {
            return <Redirect to="/login" />
        }

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
                                {user && user.name}
                                <Icon
                                    name='setting'
                                    className='icon-profile'
                                    title='Настройки'
                                    onClick={() => this.setState({component: UserProfile})}
                                />
                            </span>
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
                    </Sidebar>

                    <Sidebar.Pusher>
                        <Segment basic style={{ minHeight: '100vh', marginLeft: '170px' }}>
                            <div>
                                <CurrentComponent component={this.state.component} />
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
        user: state.auth.user,
        showModalAddTask: state.nemo.showModalAddTask,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addTaskShowModal: () => dispatch(task.addTaskShowModal()),
        addTaskHideModal: () => dispatch(task.addTaskHideModal()),
        addTask: (data) => dispatch(task.addTask(data)),
        getTasksToExecute: () => dispatch(task.getTasksToExecute()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamBase);