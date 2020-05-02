import React, { Component } from 'react';
import { Table, Header, Image, Label, Button, Form, Dropdown } from 'semantic-ui-react';
import WorkTimeEditModal from "./WorkTimeEditModal";
import TaskAddForm from "./TaskAddForm";
import { showErrorMessage, errorMessageToString, showSuccessMessage } from '../utils';


export default class InfoTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            status: this.props.task && this.props.task.status,
        }
    }

    handleChange = (e, { value }) => {
        const { token } = this.props;
        let headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let body = JSON.stringify({status: value, task_id: this.props.task.pk});

        return fetch("/api/change_status/", {headers, body, method: "POST"})
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                } else {
                    showErrorMessage('Ошибка', errorMessageToString(''));
                }
            })
            .then(res => {
                if (res.status === 200) {
                    if (res.data.success) {
                        this.setState({status: value}, () => showSuccessMessage('Успешо!', ''));
                    } else {
                        showErrorMessage('Ошибка', errorMessageToString(res.data.message));
                    }
                } else if (res.status === 403 || res.status === 401) {
                    showErrorMessage('Ошибка', errorMessageToString(''));
                } else {
                    showErrorMessage('Ошибка', errorMessageToString(''));
                }
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.status != this.props.task.status) {
            this.setState({status: this.props.task.status});
        }
    }

    render() {
        const { task, addWorkHours, toggleTaskEditMode, taskEditMode, addTask } = this.props;

        return (
            <div>
                <div style={{marginBottom: '25px'}}>
                    <Button
                        content={taskEditMode ? 'Вернуться к просмотру' : 'Редактировать'}
                        onClick={this.props.toggleTaskEditMode}
                    />
                </div>
                {taskEditMode
                    ?
                     <TaskAddForm
                        changeTask={addTask}
                        isNew={false}
                        task={task}
                     />
                    :
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
                                <Table.Cell>
                                    <Dropdown
                                        onChange={this.handleChange}
                                        options={task.status_options}
                                        placeholder='Choose an option'
                                        selection
                                        value={this.state.status}
                                        style={{ width: '150px', minWidth: '100px' }}
                                    />
                                </Table.Cell>
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
                                    {task.planned_work_hours || 0} h.
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
                                <Table.Cell>
                                    {task.work_hours || 0} h.&nbsp;
                                    <WorkTimeEditModal task_id={task.pk} addWorkHours={addWorkHours} />
                                </Table.Cell>
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
                }
            </div>
        )
    }
}
