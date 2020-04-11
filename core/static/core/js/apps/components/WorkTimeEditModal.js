import React, { Component } from 'react';
import { Icon, Modal, Form, Button, Checkbox } from 'semantic-ui-react';
import DatePicker from "react-datepicker";


export default class WorkTimeEditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            hours: 0,
            minutes: 1,
            minus_work_time: false,
            work_date: null,
            task_id: this.props.task_id,
        }
    }

    render() {
        const { addWorkHours } = this.props;
        const { comment, hours, minutes, minus_work_time, work_date } = this.state;

        const trigger = (
            <Icon
                name='plus square'
                className='work-time-edit'
                title='Отметить время'
            />
        )

        return (
            <Modal trigger={trigger} style={{position: 'relative', margin: 'relative', width: '500px', height: '500px'}}>
                <Modal.Header>Отметьте время</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form reply>
                            <Form.Group>
                                <Form.Field
                                    label='Затрачено часов'
                                    control='input'
                                    type='number'
                                    min={0}
                                    required
                                    value={hours}
                                    onChange={e => this.setState({hours: e.target.value})}
                                />
                                <Form.Field
                                    label='Затрачено минут'
                                    control='input'
                                    type='number'
                                    min={1}
                                    required
                                    value={minutes}
                                    onChange={e => this.setState({minutes: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Field>
                                <Checkbox
                                    checked={minus_work_time}
                                    label='Сминусовать время'
                                    onChange={(e, {checked}) => this.setState({minus_work_time: checked})}
                                />
                            </Form.Field>
                            <Form.Field>
                                <DatePicker
                                    className="my-picker"
                                    selected={work_date}
                                    onChange={(work_date) => this.setState({work_date: work_date})}
                                />
                            </Form.Field>
                            <Form.TextArea
                                label='Комментарий'
                                onChange={e => this.setState({comment: e.target.value})}
                                value={this.state.comment}
                                required
                            />
                            <Button
                                onClick={() => addWorkHours(this.state)}
                                content='Сохранить'
                                labelPosition='left'
                                icon='edit'
                                primary
                            />
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        )
    }
}