import React, { Component } from 'react';
import { task } from '../actions';
import { connect } from 'react-redux';
import { Tab, Icon, Image, Item, Label } from 'semantic-ui-react'

class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        }
    }

    componentDidMount() {
        this.props.getTasksToExecute();
    }

    render () {
        let items = [];
        this.props.tasks_to_execute.forEach((task) => {
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

        let panes = [
            {
                menuItem: 'Задачи на мне',
                render: () => (
                    <Tab.Pane attached={false}>
                        <Item.Group divided>
                            {items.map(item => item)}
                        </Item.Group>
                    </Tab.Pane>
                ),
            },
            {
                menuItem: 'Задачи, порученные мной',
                render: () => <Tab.Pane attached={false}>Ещё один список задач</Tab.Pane>,
            },
        ]

        return (
            <div>
                <Icon name='refresh' title='Обновить' onClick={() => console.log(this.state.activeIndex)} />
                <Tab
                    panes={panes}
                    style={{ width: '50%' }}
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
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTasksToExecute: () => dispatch(task.getTasksToExecute()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
