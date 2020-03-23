import React, { Component } from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react';


export default class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        }
    }

    onCreate = (e) => {
        e.preventDefault();
        this.props.createComment(this.state.text, this.props.task_id);
        this.setState({text: ''});
    }

    render() {
        const {comments} = this.props;

        return (
            <Comment.Group>
                {comments.length > 0
                    ?
                    comments.map((comment) => (
                        <Comment>
                            <Comment.Avatar src={comment.user.avatar_url} />
                            <Comment.Content>
                                <Comment.Author as='a'>{comment.user.name}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{comment.timestamp}</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.text}</Comment.Text>
                                <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                            </Comment.Content>
                        </Comment>
                    ))
                    :
                    <b>Нет комментариев</b>
                }

                <Form reply>
                    <Form.TextArea
                        onChange={e => this.setState({text: e.target.value})}
                        value={this.state.text}
                        required
                    />
                    <Button
                        onClick={this.onCreate.bind(this)}
                        content='Добавить комментарий'
                        labelPosition='left'
                        icon='edit'
                        primary
                    />
                </Form>
            </Comment.Group>
        )
    }
}
