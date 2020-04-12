import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import Comments from "./Comments";
import Description from "./Description";
import InfoTable from "./InfoTable";
import { connect } from 'react-redux';
import { task } from '../actions';


class TaskDetail extends Component {

    componentDidMount() {
        const { task_id, getTask } = this.props;
        if (task_id) {
            getTask(task_id);
        }
    }

    getPanes() {
        const {
            task, createComment, toggleDescriptionMode, descriptionMode, saveDescription, addWorkHours,
            addTaskShowToggle, taskEditMode, toggleTaskEditMode, addTask
        } = this.props;
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
                render: () => <Tab.Pane attached={false}>
                                  <InfoTable
                                      task={task}
                                      addWorkHours={addWorkHours}
                                      addTaskShowToggle={addTaskShowToggle}
                                      taskEditMode={taskEditMode}
                                      toggleTaskEditMode={toggleTaskEditMode}
                                      addTask={addTask}
                                  />
                              </Tab.Pane>,
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
        if (!(this.props.task && this.props.task.pk)) {
            return <div></div>;
        }

        return (
            <div className='col-sm-6'>
                <Tab menu={{ pointing: true }} panes={this.getPanes()} style={{ marginTop: '52px' }} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        task: state.nemo.task,
        descriptionMode: state.nemo.descriptionMode,
        taskEditMode: state.nemo.taskEditMode,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        createComment: (text, task_id) => dispatch(task.createComment(text, task_id)),
        toggleDescriptionMode: () => dispatch(task.toggleDescriptionMode()),
        toggleTaskEditMode: () => dispatch(task.toggleTaskEditMode()),
        saveDescription: (description, task_id) => dispatch(task.saveDescription(description, task_id)),
        addWorkHours: (data) => dispatch(task.addWorkHours(data)),
        addTaskShowToggle: () => dispatch(task.addTaskShowToggle()),
        addTask: (data) => dispatch(task.addTask(data)),
        getTask: (task_id) => dispatch(task.getTask(task_id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);
