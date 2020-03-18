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
            child_props: {
                token: props.token,
            }
        };
    }

    CurrentComponent = ({component: ChildComponent, ...props}) => {
        return <ChildComponent {...props} />
    }

    render() {
        const { isAuthenticated, addTaskShowModal, addTaskHideModal, showModalAddTask, addTask, user } = this.props;
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
                                    onClick={() => this.setState({component: UserProfile, child_props: {}})}
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
                            <Button onClick={() => this.setState({component: TaskList, child_props: {token: this.props.token}})}>
                                Мои задачи
                            </Button>
                        </Menu.Item>
                    </Sidebar>

                    <Sidebar.Pusher>
                        <Segment basic style={{ minHeight: '100vh', marginLeft: '170px' }}>
                            <div>
                                <CurrentComponent component={this.state.component} {...this.state.child_props} />
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
        token: state.auth.token,
        user: state.auth.user,
        showModalAddTask: state.nemo.showModalAddTask,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addTaskShowModal: () => dispatch(task.addTaskShowModal()),
        addTaskHideModal: () => dispatch(task.addTaskHideModal()),
        addTask: (data) => dispatch(task.addTask(data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamBase);