import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task } from '../actions';
import AddTask from './AddTask';
import TaskList from './TaskList';
import UserProfile from './UserProfile';
import TaskDetail from './TaskDetail';
import { Redirect } from "react-router-dom";
import { Icon, Image, Menu, Segment, Sidebar, Button, Dimmer, Loader } from 'semantic-ui-react';


class TeamBase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            component: UserProfile,
        };
    }

    CurrentComponent = ({component: ChildComponent}) => {
        return <ChildComponent />
    }

    render() {
        const {
            isAuthenticated, addTaskShowModal, addTaskHideModal, showModalAddTask, addTask, user, descriptionMode,
            getTasksToExecute, isLoading, createComment, task, toggleDescriptionMode, saveDescription,
        } = this.props;
        const { component } = this.state;
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
                                {user.name}
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
                        { user.is_superuser &&
                            <Menu.Item as='a'>
                                <a href='/admin/'>Администрирование</a>
                            </Menu.Item>
                        }
                    </Sidebar>

                    <Sidebar.Pusher>
                        <Segment basic style={{ minHeight: '100vh', marginLeft: '170px' }}>
                            <div class='row'>
                                <CurrentComponent component={component} />
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