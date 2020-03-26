import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task } from '../actions';
import { Card, Icon, Image } from 'semantic-ui-react';


class UserProfile extends Component {
    onFileUploadChange(event) {
        const files = event.target.files;
        const form_data = new FormData();
        form_data.append('pk', this.props.user.id);

        for (var i = 0; i < files.length; i++) {
            form_data.append(files[i].name, files[i]);
        }

        this.props.avatarUpload(form_data);
    }

    render () {
        const { user } = this.props;

        return (
            <Card className='user-profile'>
                <Image src={user.avatar_url} wrapped ui={false} />
                <form>
                    <input type='file' onChange={(e) => this.onFileUploadChange(e)} />
                </form>
                <Card.Content>
                <Card.Header>Matthew</Card.Header>
                <Card.Meta>
                    <span className='date'>Joined in 2015</span>
                </Card.Meta>
                <Card.Description>
                    Matthew is a musician living in Nashville.
                </Card.Description>
                </Card.Content>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTask: (task_id) => dispatch(task.getTask(task_id)),
        avatarUpload: (form_data) => dispatch(task.avatarUpload(form_data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
