import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import TaskAddForm from "./TaskAddForm";


export default class AddTask extends React.Component {

    render() {
        const { addTaskShowToggle, showModalAddTask, addTask } = this.props;

        return (
            <Modal
                trigger={<Button onClick={addTaskShowToggle}>Создать задачу</Button>}
                style={{position: 'relative', margin: 'relative'}}
                open={showModalAddTask}
                onClose={addTaskShowToggle}
            >
                <Modal.Header>Создание задачи</Modal.Header>
                <Modal.Content scrolling style={{maxHeight: '80vh'}}>
                    <Modal.Description>
                        <TaskAddForm
                            isNew={true}
                            changeTask={addTask}
                            addTaskShowToggle={addTaskShowToggle}
                        />
                    </Modal.Description>
                </Modal.Content>
             </Modal>
        )
    }
}
