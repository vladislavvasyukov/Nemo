import React from 'react';
import { connect } from 'react-redux';


class Companies extends React.Component {

    componentDidMount() {
        this.props.getCompanies();
    }

    render() {
        const { isAuthenticated, logout } = this.props;

        return (
            <div>
                Здесь будет список компаний
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createCompany: (name) => dispatch(task.createCompany(name)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
