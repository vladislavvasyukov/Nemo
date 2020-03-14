import React from 'react';
import { Button, Header, Icon, Image, Modal, Dropdown, TextArea } from 'semantic-ui-react';
import {Form, FormGroup, Col} from 'react-bootstrap';
import Field from './Field';
import {getTagOptions} from '../utils';


export default class AddTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            currentValues: [],
            description: '',
        }
    }

    handleAddition = (e, { value }) => {
        this.setState((prevState) => ({
            tags: [{ text: value, value:value, key:value }, ...prevState.tags],
        }))
    }

    componentDidMount() {
        fetch('/api/tags/', {credentials: 'same-origin'})
        .then((response) => {
            return response.json()
        }).then((json) => {
            let tags = []
            for (let j of json){
                tags.push({
                    key: j.title,
                    text: j.title,
                    value: j.title,
                })
            }

            this.setState({tags: tags})
        });
    }

    handleChange = (e, { value }) => this.setState({ currentValues: value })

    render() {
        const { currentValues, tags, description } = this.state;
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
                            <Field title='Теги' name='tags'>
                                <Dropdown
                                    options={tags}
                                    search
                                    selection
                                    fluid
                                    multiple
                                    allowAdditions
                                    value={currentValues}
                                    onAddItem={this.handleAddition}
                                    onChange={this.handleChange}
                                    onSearchChange={this.onSearchChange}
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
