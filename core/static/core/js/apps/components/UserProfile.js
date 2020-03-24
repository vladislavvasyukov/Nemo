import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { task } from '../actions';
import { Card, Icon, Image } from 'semantic-ui-react';


class UserProfile extends Component {
    render () {
        const { user } = this.props;

        return (
            <Card className='user-profile'>
                <Image src={user.avatar_url} wrapped ui={false} />
                <form>
                    <input type='file' onChange={(e) => console.log(e.target.form)} />
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
