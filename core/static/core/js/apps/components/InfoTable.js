import React, { Component } from 'react';
import { Table, Header, Image, Label, Icon, Modal, Form, Button, Checkbox } from 'semantic-ui-react';
import DatePicker from "react-datepicker";


class WorkTimeEditModal extends Component {

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


export default class InfoTable extends Component {

    render() {
        const { task, addWorkHours } = this.props;

        return (
            <Table basic='very' celled collapsing>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Название
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{task.title}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Проект
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{task.project.name}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Дедлайн
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{task.deadline}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Исполнитель
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>
                            <Header as='h4' image>
                                <Image src={task.executor.avatar_url} rounded size='mini' />
                                <Header.Content>
                                    {task.executor.name}
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Приёмщик
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>
                            <Header as='h4' image>
                                <Image src={task.manager.avatar_url} rounded size='mini' />
                                <Header.Content>
                                    {task.manager.name}
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Статус
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{task.status_display}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Время, план
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>
                            {task.planned_work_hours || 0} h.&nbsp;
                            <WorkTimeEditModal task_id={task.pk} addWorkHours={addWorkHours} />
                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Время, факт
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{task.work_hours || 0} h.</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Автор
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>
                            <Header as='h4' image>
                                <Image src={task.author.avatar_url} rounded size='mini' />
                                <Header.Content>
                                    {task.author.name}
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Участники
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>
                            {task.participants.map((participant) =>
                                <div style={{ marginTop: '15px' }}>
                                    <Header as='h4' image>
                                        <Image src={participant.avatar_url} rounded size='mini' />
                                        <Header.Content>
                                            {participant.name}
                                        </Header.Content>
                                    </Header>
                                </div>
                            )}
                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Тэги
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>
                            {task.tags.map((tag) =>
                                <Label as='a' color='teal' tag>
                                    {tag.title}
                                </Label>
                            )}
                        </Table.Cell>
                    </Table.Row>

                </Table.Body>
            </Table>
        )
    }
}
