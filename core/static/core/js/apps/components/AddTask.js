import React from 'react';
import { Button, Header, Icon, Image, Modal } from 'semantic-ui-react';
import {Form, FormGroup} from 'react-bootstrap';
import Field from './Field';


export default class AddTask extends React.Component {

    render() {

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
