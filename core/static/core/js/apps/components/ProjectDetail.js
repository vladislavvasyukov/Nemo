import React, { Component } from 'react';
import { connect } from 'react-redux';
import { task } from '../actions';
import { Table, Header, Image, Button, Form } from 'semantic-ui-react';
import ProjectEditForm from "./ProjectEditForm";


class ProjectDetail extends Component {

    componentDidMount() {
        const { project_id, getProject } = this.props;
        if (project_id) {
            getProject(project_id);
        }
    }

    render() {
        const { project, toggleProjectEditMode, projectEditMode, saveProject } = this.props;
        if (!project.pk) {
            return <div></div>
        }

        return (
            <div className='col-sm-6'>
                <div className='project-detail'>
                <div style={{marginBottom: '25px'}}>
                    <Button
                        content={projectEditMode ? 'Вернуться к просмотру' : 'Редактировать'}
                        onClick={toggleProjectEditMode}
                    />
                </div>
                {projectEditMode
                    ?
                    <ProjectEditForm
                        project={project}
                        saveProject={saveProject}
                    />
                    :
                    <div>
                        <Table basic='very' celled collapsing>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Header as='h4'>
                                            <Header.Content>
                                                Название
                                            </Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell>{project.name}</Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    <Table.Cell>
                                        <Header as='h4'>
                                            <Header.Content>
                                                Исполнитель
                                            </Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Header as='h4' image>
                                            <Image src={project.creator.avatar_url} rounded size='mini' />
                                            <Header.Content>
                                                {project.creator.name}
                                            </Header.Content>
                                        </Header>
                                    </Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    <Table.Cell>
                                        <Header as='h4'>
                                            <Header.Content>
                                                Участники
                                            </Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {project.participants.map((participant) =>
                                            <div style={{ marginTop: '15px' }}>
                                                <Header as='h4' image>
                                                    <Image src={participant.avatar_url} rounded size='mini' />
                                                    <Header.Content>
                                                        {participant.name}
                                                    </Header.Content>
                                                </Header>
                                            </div>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <div><b>Описание</b></div>
                        <div dangerouslySetInnerHTML={{__html: project.description}}/>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        project: state.nemo.project,
        projectEditMode: state.nemo.projectEditMode,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getProject: (project_id) => dispatch(task.getProject(project_id)),
        saveProject: (data) => dispatch(task.saveProject(data)),
        toggleProjectEditMode: () => dispatch(task.toggleProjectEditMode()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
