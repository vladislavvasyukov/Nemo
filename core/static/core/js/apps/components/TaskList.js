import React, { Component } from 'react';
import { task } from '../actions';
import { connect } from 'react-redux';
import { Button, Tab, Icon, Item, Label, Dimmer, Loader, Pagination } from 'semantic-ui-react'

class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        }
    }

    componentDidMount() {
        this.props.getTaskList(true);
        this.props.getTaskList(false);
    }

    refresh = () => {
        if (this.state.activeIndex == 0) {
            this.props.getTaskList(true);
        } else {
            this.props.getTaskList(false);
        }
    }

    getItems = (tasks) => {
        let items = [];
        tasks.forEach((task) => {
            items.push(
                <Item>
                    <Item.Content>
                        <Item.Header as='a' onClick={() => this.props.getTask(task.id)}>{task.title}</Item.Header>
                        <Item.Meta>
                            <span className='cinema'>{task.executor.name}</span>
                        </Item.Meta>
                        <Item.Description style={{ color: 'red' }}>{task.deadline}</Item.Description>
                        <Item.Extra>
                            {task.tags.map(tag => <Label>{tag.title}</Label>)}
                        </Item.Extra>
                    </Item.Content>
                </Item>
            )
        });

        return items;
    }

    render () {
        const {
            tasks_to_execute, num_pages_to_execute, manager_tasks, num_pages_manager, current_page_to_execute,
            current_page_manager,
        } = this.props;

        if (tasks_to_execute.length == 0 && manager_tasks.length == 0) {
            return <div></div>
        }

        let panes = [
            {
                menuItem: 'Задачи на мне',
                render: () => (
                    <Tab.Pane attached={false}>
                        <Item.Group divided>
                            {this.getItems(tasks_to_execute).map(item => item)}
                            {num_pages_to_execute > 1 &&
                                <Item>
                                    <Pagination
                                        activePage={current_page_to_execute}
                                        totalPages={num_pages_to_execute}
                                        onPageChange={(e, {activePage}) => this.props.getTaskList(true, activePage)}
                                    />
                                </Item>
                            }
                        </Item.Group>
                    </Tab.Pane>
                ),
            },
            {
                menuItem: 'Задачи, порученные мной',
                render: () => (
                    <Tab.Pane attached={false}>
                        <Item.Group divided>
                            {this.getItems(manager_tasks).map(item => item)}
                            {num_pages_manager > 1 &&
                                <Item>
                                    <Pagination
                                        activePage={current_page_manager}
                                        totalPages={num_pages_manager}
                                        onPageChange={(e, {activePage}) => this.props.getTaskList(false, activePage)}
                                    />
                                </Item>
                            }
                        </Item.Group>
                    </Tab.Pane>
                ),
            },
        ]

        return (
            <div className='col-sm-6'>
                <Dimmer active={this.props.isLoading} inverted>
                    <Loader size='medium'>Loading</Loader>
                </Dimmer>
                <Button style={{ width: '50px', color: 'black' }}>
                    <Icon
                        name='refresh'
                        title='Обновить'
                        onClick={this.refresh}
                    />
                </Button>
                <Tab
                    panes={panes}
                    style={{ marginTop: '15px' }}
                    menu={{ pointing: true }}
                    onTabChange={(e, {activeIndex}) => this.setState({activeIndex})}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {
        tasks_to_execute, current_page_to_execute, manager_tasks, current_page_manager,
        isLoading, num_pages_to_execute, num_pages_manager,
    } = state.nemo;

    return {
        tasks_to_execute: tasks_to_execute,
        current_page_to_execute: current_page_to_execute,
        num_pages_to_execute: num_pages_to_execute,

        manager_tasks: manager_tasks,
        current_page_manager: current_page_manager,
        num_pages_manager: num_pages_manager,

        isLoading: isLoading,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTaskList: (to_execute, page) => dispatch(task.getTaskList(to_execute, page)),
        getTask: (task_id) => dispatch(task.getTask(task_id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
