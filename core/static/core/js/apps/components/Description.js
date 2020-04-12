import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import TinyEditorComponent from "./TinyEditorComponent";

export default class Description extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.task.description,
        }
    }

    onSaveDescription = (e) => {
        e.preventDefault();
        this.props.saveDescription(this.state.text, this.props.task.pk);
    }

    componentDidUpdate(prevProps) {
        if (this.props.task.pk !== prevProps.task.pk) {
            this.setState({text: this.props.task.description});
        }
    }

    render() {
        const { descriptionMode, toggleDescriptionMode } = this.props;
        const {text} = this.state;

        return (
            <div>
                <div>
                    <Button
                        content={descriptionMode ? 'Вернуться к просмотру' : 'Редактировать'}
                        onClick={toggleDescriptionMode}
                    />
                </div>
                <div style={{marginTop: '25px'}}>
                {
                    descriptionMode
                        ?
                        <Form reply>
                            <TinyEditorComponent
                                id={'id' + (new Date()).getTime()}
                                className='quill-max-height-50vh'
                                name='description'
                                value={text}
                                onChange={text => this.setState({text})}
                            />
                            <Button
                                onClick={this.onSaveDescription.bind(this)}
                                content='Сохранить'
                                labelPosition='left'
                                icon='edit'
                                primary
                            />
                        </Form>
                        :
                        <div dangerouslySetInnerHTML={{__html: this.props.task.description}}/>
                }
                </div>
            </div>
        )
    }
}
