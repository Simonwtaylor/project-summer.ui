import * as React from 'react';
import { Modal, Header } from 'semantic-ui-react';
import { ITask } from '../../lib/types'
import { UserDropdownContainer } from '../dropdowns';

export interface ITaskModalProps {
  task: ITask;
  onModalClose: () => void;
  socket?: SocketIOClient.Socket;
}
 
const TaskModal: React.FC<ITaskModalProps> = ({
  task,
  onModalClose,
  socket
}) => {
  return (
    <Modal centered={false} open={true} onClose={() => onModalClose()}>
      <Modal.Header>
        {task.title}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Default Profile Image</Header>
          <UserDropdownContainer
            name={'userId'}
            onSelectUser={(user: any) => console.log(user)}
            socket={socket}
          />
          <p>Is it okay to use this photo?</p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}
 
export default TaskModal;