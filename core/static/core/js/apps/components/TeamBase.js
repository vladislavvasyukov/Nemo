import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../actions';
import { Redirect } from "react-router-dom";
import { Container, List, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'


class TeamBase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        };
    }

    render() {

        if (!this.props.isAuthenticated) {
            return <Redirect to="/login" />
        }

        return (
            <Container style={{ margin: 20 }}>
                <Header as="h3">This example is powered by Semantic UI React 😊</Header>
                <List bulleted>
                    <List.Item
                        as="a"
                        content="💌 Official documentation"
                        href="https://react.semantic-ui.com/"
                        target="_blank"
                    />
                    <List.Item
                        as="a"
                        content="💡 StackOverflow"
                        href="https://stackoverflow.com/questions/tagged/semantic-ui-react?sort=frequent"
                        target="_blank"
                    />
                </List>
                <button onClick={() => this.setState({visible: true})}>Show</button>

                <Sidebar.Pushable as={Segment}>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    inverted
                    onHide={() => this.setState({visible: false})}
                    vertical
                    visible={this.state.visible}
                    width='thin'
                >
                    <Menu.Item as='a'>
                        <Icon name='home' />
                        Home
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='gamepad' />
                        Games
                    </Menu.Item>
                    <Menu.Item as='a'>
                        <Icon name='camera' />
                        Channels
                    </Menu.Item>
                </Sidebar>

                <Sidebar.Pusher dimmed={this.state.visible}>
                    <Segment basic>
                        <Header as='h3'>Application Content</Header>
                        <div>
                            something content
                        </div>
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setErrors: (errors) => dispatch(auth.setErrors(errors))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamBase);
