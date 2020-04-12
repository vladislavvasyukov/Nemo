import React from 'react';
import 'moment';
import { Dropdown, TextArea, Button } from 'semantic-ui-react';
import {Form, FormGroup, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Field from './Field';
import TinyEditorComponent from './TinyEditorComponent';
import {getTagOptions, getProjectOptions, getUserOptions} from '../utils';
import "react-datepicker/dist/react-datepicker.css"


export default class ProjectEditForm extends React.Component {
    constructor(props) {
        super(props);

        const { project } = this.props;
        let description = '';
        if (project && project.description) {
            description = project.description;
        }

        this.state = {
            participants_options: [],
            participants: [],
            description: description,
            name: '',
        }
    }

    componentDidMount() {
        const { project } = this.props;
        if (project && project.pk) {
            this.setState({
                name: project.name,
                participants: project.participants.map(p => p.id),
                description: project.description,
            });
        }
        this.getParticipantsOptions()
    }

    getParticipantsOptions(q='') {
        getUserOptions(q, (participants_options) => {
            this.setState({ participants_options: participants_options});
        }, undefined, this.props.project && this.props.project.pk);
    }

    handleChangeParticipants = (e, { value }) => {
        this.setState({ participants: value }, () => this.getParticipantsOptions());
    }

    onSave(e) {
        e.preventDefault();

        const { name, participants, description } = this.state;
        const { project } = this.props;

        let data = {
            name, participants, description
        }
        if (project && project.pk) {
            data.project_id = project.pk
        }

        this.props.saveProject(data);
    }

    render() {
        const { name, description, participants, participants_options } = this.state;
        const { project, addProjectShowToggle } = this.props

        return (
            <Form onSubmit={this.onSave.bind(this)}>
                <Field title='Название' required={true} name='title'>
                    <input
                        className='textinput textInput form-control'
                        maxLength='256'
                        type='text'
                        defaultValue={name}
                        required
                        onChange={(e) => this.setState({name: e.target.value})}
                    />
                </Field>

                <Field title='Участники задачи' name='participants'>
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
                <TinyEditorComponent
                    id={'id' + (new Date()).getTime()}
                    className='quill-max-height-50vh'
                    name='description'
                    value={description}
                    onChange={description => this.setState({description})}
                />
                <FormGroup style={{ marginTop: '30px' }}>
                    <Button
                        content={project && project.pk ? 'Сохранить' : 'Добавить'}
                        type='submit'
                        disabled={!description}
                        primary
                    />
                    {addProjectShowToggle
                        ?
                        <Button content='Закрыть' onClick={addProjectShowToggle} secondary />
                        :
                        null
                    }
                </FormGroup>
            </Form>
        )
    }
}