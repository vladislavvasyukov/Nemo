import React, { Component } from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react';


export default class Comments extends Component {
    render() {
        const {comments} = this.props;

        return (
            <Comment.Group>
                {comments.map((comment) => (
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
                ))}

                <Form reply>
                    <Form.TextArea />
                    <Button content='Добавить комментарий' labelPosition='left' icon='edit' primary />
                </Form>
            </Comment.Group>
        )
    }
}
