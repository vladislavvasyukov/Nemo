import React from 'react';
import { Button, Header, Icon, Image, Modal, Dropdown, TextArea } from 'semantic-ui-react';
import {Form, FormGroup, Col} from 'react-bootstrap';
import Field from './Field';
import {getTagOptions, getProjectOptions, getUserOptions} from '../utils';


export default class AddTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            projects: [],
            executor_users: [],

            currentTags: [],
            currentProject: null,
            executor: null,
            description: '',
        }
    }

    componentDidMount() {
        this.getTags();
        this.getProjects();
        this.getExecutorUsers();
    }

    getTags(q='') {
        getTagOptions(q, (tags) => {
            let fake_tags = [];
            this.state.currentTags.forEach((value) => {
                if (tags.every(tag => tag.value != value)) {
                    let prev = this.state.tags.find(tag => tag.value == value);
                    fake_tags.push(prev);
                }
            });

            this.setState({tags: tags.concat(fake_tags)})
        });
    }

    handleAdditionTag = (e, { value }) => {
        this.setState((prevState) => ({
            tags: [{ text: value, value:value, key:value }, ...prevState.tags],
        }))
    }

    handleChangeTags = (e, { value }) => {
        this.setState({ currentTags: value }, () => this.getTags());
    }

    getProjects(q='') {
        getProjectOptions(q, (projects) => {
            this.setState({projects: projects});
        });
    }

    handleChangeProject = (e, { value }) => {
        this.setState({ currentProject: value }, () => this.getProjects());
    }

    getExecutorUsers(q='') {
        getUserOptions(q, (users) => {
            this.setState({ executor_users: users });
        });
    }

    handleChangeExecutor = (e, { value }) => {
        this.setState({ executor: value }, () => this.getExecutorUsers());
    }

    render() {
        const { currentTags, tags, currentProject, projects, executor, executor_users, description } = this.state;
        const { addTaskShowModal, addTaskHideModal, showModalAddTask, addTask } = this.props;

        return (
            <Modal
                trigger={<Button onClick={addTaskShowModal}>Создать задачу</Button>}
                style={{position: 'relative', margin: 'relative'}}
                open={showModalAddTask}
                onClose={addTaskHideModal}
            >
                <Modal.Header>Создание задачи</Modal.Header>
                <Modal.Content scrolling>
                    <Modal.Description>
                        <Form>
                            <Field title='Заголовок' required={true} name='title'>
                                <input
                                    className='textinput textInput form-control'
                                    maxLength='256'
                                    type='text'
                                />
                            </Field>

                            <Field title='Проект' name='project'>
                                <Dropdown
                                    options={projects}
                                    search
                                    selection
                                    fluid
                                    value={currentProject}
                                    onChange={this.handleChangeProject}
                                    onSearchChange={(e, {searchQuery}) => this.getProjects(searchQuery)}
                                 />
                            </Field>

                            <Field title='Исполнитель' name='executor'>
                                <Dropdown
                                    options={executor_users}
                                    search
                                    selection
                                    fluid
                                    value={executor}
                                    onChange={this.handleChangeExecutor}
                                    onSearchChange={(e, {searchQuery}) => this.getExecutorUsers(searchQuery)}
                                 />
                            </Field>

                            <Field title='Приемщик' name='manager'>
                            </Field>

                            <Field title='Дедлайн' name='deadline'>
                            </Field>

                            <Field title='Теги' name='tags'>
                                <Dropdown
                                    options={tags}
                                    search
                                    selection
                                    fluid
                                    multiple
                                    allowAdditions={true}
                                    value={currentTags}
                                    onAddItem={this.handleAdditionTag}
                                    onChange={this.handleChangeTags}
                                    onSearchChange={(e, {searchQuery}) => this.getTags(searchQuery)}
                                 />
                            </Field>

                            <Field title='Описание' name='description'>
                                <TextArea
                                    placeholder='...'
                                    style={{ minHeight: 300, width: '100%' }}
                                    value={description}
                                    onChange={(e, {value}) => this.setState({description: value}) }
                                />
                            </Field>

                            <Field title='Участники задачи' name='participants'>
                            </Field>

                            <Field title='Трудоёмкость плановая, час' name='planned_work_hours'>
                            </Field>

                        </Form>

                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button content='Добавить' onClick={addTask} primary />
                    <Button content='Закрыть' onClick={addTaskHideModal} secondary />
                </Modal.Actions>
             </Modal>
        )
    }
}
