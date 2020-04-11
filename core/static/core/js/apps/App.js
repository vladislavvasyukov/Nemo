import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';

import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import {auth} from "./actions";
import nemoApp from "./reducers";

import {
    SignInForm,
    SignUpForm,
    Menu,
    NotFound,
    MainPage,
    TeamBase,
    RecoverPassword,
    TaskList,
    ProjectList,
    UserProfile,
} from "./components";


let store = createStore(nemoApp, applyMiddleware(thunk));


class RootContainerComponent extends Component {

    componentDidMount() {
        this.props.loadUser();
    }

    LoadingRoute = ({component: ChildComponent, ...rest}) => {
        return <Route {...rest} render={props => {
            if (this.props.auth.isLoading) {
                return <em>Loading...</em>;
            } else {
                return <ChildComponent {...props} />
            }
        }} />
    }

    MyRoute = ({component: ChildComponent, ...props}) => {
        return <ChildComponent {...props} />
    }

    render() {
        let { LoadingRoute, MyRoute } = this;

        return (
            <BrowserRouter>
                <Switch>
                    <LoadingRoute exact path="/" component={MainPage} />

                    <Route exact path="/team" component={TeamBase} />
                    <MyRoute exact path="/team/tasks/" component={TeamBase} initial={TaskList} />
                    <MyRoute exact path="/team/projects/" component={TeamBase} initial={ProjectList} />
                    <MyRoute exact path="/team/user_profile/" component={TeamBase} initial={UserProfile} />

                    <Route exact path="/register" component={SignUpForm} />
                    <Route exact path="/login" component={SignInForm} />
                    <Route exact path="/recover" component={RecoverPassword} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => dispatch(auth.loadUser()),
    }
}

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <RootContainer />
            </Provider>
        )
    }
}
