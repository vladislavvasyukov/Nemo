import React from 'react';
import { Button, Header, Icon, Image, Modal } from 'semantic-ui-react';
import {Form, FormGroup} from 'react-bootstrap';
import Field from './Field';
import {getTagOptions} from '../utils';
import { Dropdown } from 'semantic-ui-react'

const tags = [
  { key: 'English', text: 'English', value: 'English' },
  { key: 'French', text: 'French', value: 'French' },
  { key: 'Spanish', text: 'Spanish', value: 'Spanish' },
  { key: 'German', text: 'German', value: 'German' },
  { key: 'Chinese', text: 'Chinese', value: 'Chinese' },
]

class DropdownExampleAllowAdditions extends React.Component {


  render() {
    const { currentValues } = this.state

    return (
      <Dropdown
        options={this.state.options}
        search
        selection
        fluid
        multiple
        allowAdditions
        value={currentValues}
        onAddItem={this.handleAddition}
        onChange={this.handleChange}
      />
    )
  }
}


export default class AddTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: tags,
            currentValues: {},
        }
    }

    handleAddition = (e, { value }) => {
        this.setState((prevState) => ({
            tags: [{ text: value, value:value, key:value }, ...prevState.tags],
        }))
    }

    componentDidMount() {
        fetch('/api/tags/?q="ед"', {credentials: 'same-origin'})
        .then((response) => {
            return response.json()
        }).then((json) => {
            console.log(json)
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
        const { currentValues, tags } = this.state

        return (
            <Modal trigger={<Button>Создать задачу</Button>} style={{position: 'relative', margin: 'relative'}}>
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
                                 />
                            </Field>
                        </Form>

                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary>
                        Proceed <Icon name='chevron right' />
                    </Button>
                </Modal.Actions>
             </Modal>
        )
    }
}
