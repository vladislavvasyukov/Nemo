import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import ProjectEditForm from "./ProjectEditForm";


export default class AddProject extends React.Component {

    render() {
        const { addProjectShowToggle, showModalAddProject, saveProject } = this.props;

        return (
            <Modal
                trigger={<Button onClick={addProjectShowToggle}>Создать проект</Button>}
                style={{position: 'relative', margin: 'relative', height: '550px'}}
                open={showModalAddProject}
                onClose={addProjectShowToggle}
            >
                <Modal.Header>Создание проекта</Modal.Header>
                <Modal.Content scrolling style={{maxHeight: '80vh'}}>
                    <Modal.Description>
                        <ProjectEditForm
                            addProjectShowToggle={addProjectShowToggle}
                            saveProject={saveProject}
                        />
                    </Modal.Description>
                </Modal.Content>
             </Modal>
        )
    }
}
