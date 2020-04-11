import React, { Component } from 'react';
import { task } from '../actions';
import { connect } from 'react-redux';
import { Button, Tab, Icon, Item, Label, Dimmer, Loader, Pagination } from 'semantic-ui-react'

class ProjectList extends Component {

    render () {
        return (
            <div>
                Здесь будет список проектов
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { isLoading } = state.nemo;

    return {
        isLoading: isLoading,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTaskList: (to_execute, page) => dispatch(task.getTaskList(to_execute, page)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
