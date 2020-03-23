import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import Comments from "./Comments";
import Description from "./Description";


export default class TaskDetail extends Component {

    getPanes() {
        const { task, createComment, toggleDescriptionMode, descriptionMode, saveDescription } = this.props;
        const comments = task.comments || [];
        return [
            {
                menuItem: 'Комментарии',
                render: () => <Tab.Pane attached={false} style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                  <Comments
                                      task_id={task.pk}
                                      comments={comments}
                                      createComment={createComment}
                                  />
                              </Tab.Pane>,
            },
            {
                menuItem: 'Задача',
                render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
            },
            {
                menuItem: 'Описание',
                render: () => <Tab.Pane attached={false}>
                                  <Description
                                      task={task}
                                      toggleDescriptionMode={toggleDescriptionMode}
                                      descriptionMode={descriptionMode}
                                      saveDescription={saveDescription}
                                  />
                              </Tab.Pane>,
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
