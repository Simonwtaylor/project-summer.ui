import * as React from 'react';
import { Modal, Header } from 'semantic-ui-react';
import { ITask } from '../../lib/types'

export interface ITaskModalProps {
  task: ITask;
  onModalClose: () => void;
}
 
const TaskModal: React.FC<ITaskModalProps> = ({
  task,
  onModalClose,
}) => {
  return (
    <Modal centered={false} open={true} onClose={() => onModalClose()}>
      <Modal.Header>{task.title}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Default Profile Image</Header>
          <p>
            We've found the following gravatar image associated with your e-mail
            address.
          </p>
          <p>Is it okay to use this photo?</p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}
 
export default TaskModal;