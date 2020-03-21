import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import Comments from "./Comments";


export default class TaskDetail extends Component {

    getPanes() {
        const comments = (this.props.task && this.props.task.comments) || [];
        return [
            {
                menuItem: 'Комментарии',
                render: () => <Tab.Pane attached={false}><Comments comments={comments}/></Tab.Pane>,
            },
            {
                menuItem: 'Задача',
                render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
            },
            {
                menuItem: 'Описание',
                render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
            },
        ]
    }

    render() {
        return (
            <div className='col-sm-6'>
                <Tab menu={{ pointing: true }} panes={this.getPanes()} style={{ marginTop: '52px' }} />
            </div>
        )
    }
}
