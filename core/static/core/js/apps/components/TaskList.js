import React, { Component } from 'react';
import { task } from '../actions';
import { connect } from 'react-redux';
import { Button, Tab, Icon, Image, Item, Label, Dimmer, Loader } from 'semantic-ui-react'

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
                        <Item.Header as='a'>{task.title}</Item.Header>
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
        let panes = [
            {
                menuItem: 'Задачи на мне',
                render: () => (
                    <Tab.Pane attached={false}>
                        <Item.Group divided>
                            {this.getItems(this.props.tasks_to_execute).map(item => item)}
                        </Item.Group>
                    </Tab.Pane>
                ),
            },
            {
                menuItem: 'Задачи, порученные мной',
                render: () => (
                    <Tab.Pane attached={false}>
                        <Item.Group divided>
                            {this.getItems(this.props.manager_tasks).map(item => item)}
                        </Item.Group>
                    </Tab.Pane>
                ),
            },
        ]

        return (
            <div>
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
                    style={{ width: '50%', marginTop: '15px' }}
                    menu={{ pointing: true }}
                    onTabChange={(e, {activeIndex}) => this.setState({activeIndex})}o
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        tasks_to_execute: state.nemo.tasks_to_execute,
        manager_tasks: state.nemo.manager_tasks,
        isLoading: state.nemo.isLoading,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTaskList: (to_execute) => dispatch(task.getTaskList(to_execute)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
