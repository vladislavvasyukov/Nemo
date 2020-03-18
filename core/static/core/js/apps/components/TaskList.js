import React, { Component } from 'react';
import { Tab, Button, Icon, Image, Item, Label } from 'semantic-ui-react'

export default class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
        }
    }

    componentDidMount() {
        if (this.props.token) {
            let headers = {
                "Content-Type": "application/json",
                "Authorization": `Token ${this.props.token}`,
            };

            fetch(`/api/tasks/`, {headers})
                .then((response) => {
                    return response.json()
                }).then((tasks) => {
                    console.log(tasks)
                    this.setState({tasks})
                });
        }
    }

    render () {
        let items = [];
        this.state.tasks.forEach((task) => {
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

        return <Tab style={{ width: '50%' }} menu={{ pointing: true }} panes={panes} />
    }
}
