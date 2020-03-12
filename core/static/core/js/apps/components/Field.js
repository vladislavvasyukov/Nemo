import React, {Component} from 'react'
import {FormGroup, Col} from 'react-bootstrap'
import PropTypes from 'prop-types';

export default class FormField extends Component {
    render() {
        const {children, title, required, name, overlay} = this.props;
        const childrenProps = {name};
        const childrenWithProps = React.Children.map(children, (child) => React.cloneElement(child, childrenProps));
        return <FormGroup controlId={name}>
            <Col xs={2} className='text-align-left'>
                {title}
                {required && <span className='asteriskField'>*</span>}
            </Col>
            <Col xs={10}>
                {childrenWithProps}
            </Col>
        </FormGroup>
    }
}
