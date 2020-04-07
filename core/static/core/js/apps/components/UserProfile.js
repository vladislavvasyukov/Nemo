import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task, auth } from '../actions';
import Companies from './Companies';
import { Card, Icon, Image, Button, Form } from 'semantic-ui-react';


class UserProfile extends Component {
    constructor(props) {
        super(props);

        const user = this.props.user;
        this.state = {
            name: user.name,
            email: user.email,
            telegram: user.telegram,
            skype: user.skype,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.user.id != prevProps.user.id) {
            this.setState({...this.props.user});
        }
    }

    onFileUploadChange(event) {
        const files = event.target.files;
        const form_data = new FormData();
        form_data.append('pk', this.props.user.id);

        for (var i = 0; i < files.length; i++) {
            form_data.append(files[i].name, files[i]);
        }

        this.props.avatarUpload(form_data);
    }

    handleSubmit = () => {
        const { name, email, telegram, skype } = this.state;
        this.props.saveUserProfile({name, email, telegram, skype}, this.props.user.id);
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    render () {
        const { user, logout } = this.props;
        const { name, email, telegram, skype } = this.state;

        return (
            <div>
                <div className="user-profile">
                    <div><h2 style={{ marginBottom: '35px' }}>Профиль</h2></div>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <Card style={{ minHeight: '290px' }}>
                                <Image src={user.avatar_url} wrapped ui={false} />
                                <form>
                                    <input type='file' onChange={(e) => this.onFileUploadChange(e)} />
                                </form>
                            </Card>
                            <div style={{ marginLeft: '40px' }}>
                                <Button onClick={logout}>Выход из аккаунта</Button>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group>
                                    <Form.Input
                                        label='Name'
                                        name='name'
                                        value={name}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Input
                                        label='Email'
                                        name='email'
                                        value={email}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Input
                                        label='Telegram'
                                        name='telegram'
                                        value={telegram}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Input
                                        label='Skype'
                                        name='skype'
                                        value={skype}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Button content='Submit' />
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                </div>
                <Companies />
            </div>
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
        logout: () => dispatch(auth.logout()),
        getTask: (task_id) => dispatch(task.getTask(task_id)),
        avatarUpload: (form_data) => dispatch(task.avatarUpload(form_data)),
        saveUserProfile: (data, user_id) => dispatch(task.saveUserProfile(data, user_id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
