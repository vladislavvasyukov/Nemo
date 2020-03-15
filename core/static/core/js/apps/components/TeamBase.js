import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task } from '../actions';
import AddTask from './AddTask';
import { Redirect } from "react-router-dom";
import { Container, List, Header, Icon, Image, Menu, Segment, Sidebar, Button } from 'semantic-ui-react'


class TeamBase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            show: false,
        };
    }

    render() {
        const { isAuthenticated, addTaskShowModal, addTaskHideModal, showModalAddTask, addTask } = this.props;

        if (!isAuthenticated) {
            return <Redirect to="/login" />
        }

        return (
            <div className='sdasdfasdf'>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar
                        as={Menu}
                        animation='push'
                        icon='labeled'
                        inverted
                        onHide={() => this.setState({visible: false})}
                        vertical
                        visible={this.state.visible}
                        width='thin'
                    >
                        <Menu.Item as='a'>
                            <AddTask
                                addTaskShowModal={addTaskShowModal}
                                addTaskHideModal={addTaskHideModal}
                                showModalAddTask={showModalAddTask}
                                addTask={addTask}
                            />
                        </Menu.Item>
                        <Menu.Item as='a'>
                            <Icon name='gamepad' />
                            Games
                        </Menu.Item>
                        <Menu.Item as='a'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                    </Sidebar>

                    <Sidebar.Pusher dimmed={this.state.visible}>
                        <Segment basic>
                            <Header as='h3'>Application Content</Header>
                            <button onClick={() => this.setState({visible: true, show: true})}>Show</button>
                            <div style={{ minHeight: '600px'}}>
                                CONTENT
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
        showModalAddTask: state.nemo.showModalAddTask,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addTaskShowModal: () => dispatch(task.addTaskShowModal()),
        addTaskHideModal: () => dispatch(task.addTaskHideModal()),
        addTask: () => dispatch(task.addTask()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamBase);