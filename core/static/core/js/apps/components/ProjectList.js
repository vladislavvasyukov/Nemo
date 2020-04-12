import React, { Component } from 'react';
import { task } from '../actions';
import { connect } from 'react-redux';
import AddProject from './AddProject';
import { Button, Tab, Icon, Item, Label, Dimmer, Loader, Pagination } from 'semantic-ui-react'

class ProjectList extends Component {

    componentDidMount() {
        this.props.getProjectList();
    }

    refresh = () => this.props.getProjectList();

    getItems = (projects) => {
        let items = [];
        projects.forEach((project) => {
            items.push(
                <Item>
                    <Item.Content>
                        <Item.Header as='a' onClick={() => this.props.getProject(project.pk)}>
                            {project.name}
                        </Item.Header>
                        <Item.Meta>
                            <span className='cinema'>{project.creator.name}</span>
                        </Item.Meta>
                    </Item.Content>
                </Item>
            )
        });

        return items;
    }

    render () {
        const {
            projects, projects_pages_number, current_project_page, saveProject, addProjectShowToggle,
            showModalAddProject
        } = this.props;

        if (projects.length == 0) {
            return <div></div>
        }

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
                <AddProject
                    showModalAddProject={showModalAddProject}
                    addProjectShowToggle={addProjectShowToggle}
                    saveProject={saveProject}
                />
                <Item.Group divided className='project-list'>
                    {this.getItems(projects).map(projects => projects)}
                    {projects_pages_number > 1 &&
                        <Item>
                            <Pagination
                                activePage={current_project_page}
                                totalPages={projects_pages_number}
                                onPageChange={(e, {activePage}) => this.props.getProjectList(activePage)}
                            />
                        </Item>
                    }
                </Item.Group>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { isLoading, projects, current_project_page, projects_pages_number, showModalAddProject } = state.nemo;

    return {
        isLoading: isLoading,
        projects: projects,
        current_project_page: current_project_page,
        projects_pages_number: projects_pages_number,
        showModalAddProject: showModalAddProject,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getProjectList: (page) => dispatch(task.getProjectList(page)),
        getProject: (project_id) => dispatch(task.getProject(project_id)),
        addProjectShowToggle: () => dispatch(task.addProjectShowToggle()),
        saveProject: (data) => dispatch(task.saveProject(data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
