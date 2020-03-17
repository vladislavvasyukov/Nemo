import React from 'react';
import 'moment';
import { Button, Header, Icon, Image, Modal, Dropdown, TextArea } from 'semantic-ui-react';
import {Form, FormGroup, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Field from './Field';
import {getTagOptions, getProjectOptions, getUserOptions} from '../utils';
import "react-datepicker/dist/react-datepicker.css"


export default class AddTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tags_options: [],
            project_options: [],
            executor_options: [],
            manager_options: [],
            participants_options: [],

            tags: [],
            project: null,
            executor: null,
            manager: null,
            participants: [],
            description: '',
            title: '',
            deadline: null,
            planned_work_hours: null,
        }
    }

    componentDidMount() {
        this.getTags();
        this.getProjects();
        this.getExecutorUsers();
        this.getManagerUsers();
        this.getParticipantsOptions()
    }

    getTags(q='') {
        getTagOptions(q, (tags_options) => {
            let fake_tags = [];
            this.state.tags.forEach((value) => {
                if (tags_options.every(tag => tag.value != value)) {
                    let prev = this.state.tags_options.find(tag => tag.value == value);
                    fake_tags.push(prev);
                }
            });

            this.setState({tags_options: tags_options.concat(fake_tags)})
        });
    }

    handleAdditionTag = (e, { value }) => {
        this.setState((prevState) => ({
            tags_options: [{ text: value, value:value, key:value }, ...prevState.tags_options],
        }))
    }

    handleChangeTags = (e, { value }) => {
        this.setState({ tags: value }, () => this.getTags());
    }

    getProjects(q='') {
        getProjectOptions(q, (project_options) => {
            this.setState({project_options: project_options});
        });
    }

    handleChangeProject = (e, { value }) => {
        this.setState({ project: value }, () => this.getProjects());
    }

    getExecutorUsers(q='') {
        getUserOptions(q, (executor_options) => {
            this.setState({ executor_options: executor_options });
        });
    }

    handleChangeExecutor = (e, { value }) => {
        this.setState({ executor: value }, () => this.getExecutorUsers());
    }

    getManagerUsers(q='') {
        getUserOptions(q, (manager_options) => {
            this.setState({ manager_options: manager_options });
        });
    }

    handleChangeManager = (e, { value }) => {
        this.setState({ manager: value }, () => this.getManagerUsers());
    }

    getParticipantsOptions(q='') {
        getUserOptions(q, (participants_options) => {
            this.setState({ participants_options: participants_options});
        });
    }

    handleChangeParticipants = (e, { value }) => {
        this.setState({ participants: value }, () => this.getParticipantsOptions());
    }

    addTask(e) {
        e.preventDefault();

        const {
            tags, project, executor, manager, participants, description, planned_work_hours, title,
        } = this.state;

        let {deadline} = this.state;
        deadline = moment(deadline).format('YYYY-MM-DD')

        this.props.addTask({
            tags, project, executor, manager, participants, description, deadline, planned_work_hours, title
        });
    }

    render() {
        const {
            tags, tags_options, project, project_options, executor, executor_options, manager, manager_options,
            participants, participants_options, description, deadline, planned_work_hours, title,
        } = this.state;
        const { addTaskShowModal, addTaskHideModal, showModalAddTask } = this.props;

        return (
            <Modal
                trigger={<Button onClick={addTaskShowModal}>Создать задачу</Button>}
                style={{position: 'relative', margin: 'relative'}}
                open={showModalAddTask}
                onClose={addTaskHideModal}
            >
                <Modal.Header>Создание задачи</Modal.Header>
                <Modal.Content scrolling style={{maxHeight: '80vh'}}>
                    <Modal.Description>
                        <Form onSubmit={this.addTask.bind(this)}>
                            <Field title='Заголовок' required={true} name='title'>
                                <input
                                    className='textinput textInput form-control'
                                    maxLength='256'
                                    type='text'
                                    defaultValue={title}
                                    required
                                    onChange={(e) => this.setState({title: e.target.value})}
                                />
                            </Field>

                            <Field title='Проект' name='project' required={true}>
                                <Dropdown
                                    options={project_options}
                                    search
                                    selection
                                    fluid
                                    value={project}
                                    onChange={this.handleChangeProject}
                                    onSearchChange={(e, {searchQuery}) => this.getProjects(searchQuery)}
                                 />
                            </Field>

                            <Field title='Описание' name='description' required={true}>
                                <TextArea
                                    placeholder='...'
                                    style={{ minHeight: 300, width: '100%' }}
                                    value={description}
                                    onChange={(e, {value}) => this.setState({description: value}) }
                                />
                            </Field>

                            <Field title='Исполнитель' name='executor' required={true}>
                                <Dropdown
                                    options={executor_options}
                                    search
                                    selection
                                    fluid
                                    value={executor}
                                    onChange={this.handleChangeExecutor}
                                    onSearchChange={(e, {searchQuery}) => this.getExecutorUsers(searchQuery)}
                                 />
                            </Field>

                            <Field title='Приемщик' name='manager' required={true}>
                                 <Dropdown
                                    options={manager_options}
                                    search
                                    selection
                                    fluid
                                    value={manager}
                                    onChange={this.handleChangeManager}
                                    onSearchChange={(e, {searchQuery}) => this.getManagerUsers(searchQuery)}
                                 />
                            </Field>

                            <Field title='Участники задачи' name='participants' required={true}>
                                <Dropdown
                                    options={participants_options}
                                    search
                                    selection
                                    fluid
                                    multiple
                                    value={participants}
                                    onChange={this.handleChangeParticipants}
                                    onSearchChange={(e, {searchQuery}) => this.getParticipantsOptions(searchQuery)}
                                />
                            </Field>

                            <Field title='Дедлайн' name='deadline' required={true}>
                                <DatePicker
                                    className="my-picker"
                                    selected={deadline}
                                    dateFormat='yyyy-mm-dd'
                                    onChange={(deadline) => this.setState({deadline: deadline})}
                                />
                            </Field>

                            <Field title='Теги' name='tags' required={true}>
                                <Dropdown
                                    options={tags_options}
                                    search
                                    selection
                                    fluid
                                    multiple
                                    allowAdditions={true}
                                    value={tags}
                                    onAddItem={this.handleAdditionTag}
                                    onChange={this.handleChangeTags}
                                    onSearchChange={(e, {searchQuery}) => this.getTags(searchQuery)}
                                />
                            </Field>

                            <Field title='Трудоёмкость плановая, час' name='planned_work_hours'>
                                <input
                                    className='form-control'
                                    step='any'
                                    min={0}
                                    type='number'
                                    defaultValue={planned_work_hours}
                                    onChange={(e) => this.setState({planned_work_hours: e.target.value})}
                                />
                            </Field>
                            <FormGroup>
                                <Button content='Добавить' type='submit' primary />
                                <Button content='Закрыть' onClick={addTaskHideModal} secondary />
                            </FormGroup>

                        </Form>

                    </Modal.Description>
                </Modal.Content>

             </Modal>
        )
    }
}
