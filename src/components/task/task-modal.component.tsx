import * as React from 'react';
import { Modal, Header, Input } from 'semantic-ui-react';
import { UserDropdownContainer } from '../dropdowns';

export interface ITaskModalProps {
  id: string;
  title: string;
  boardId?: string;
  description?: string;
  dateAdded?: Date;
  onModalClose: () => void;
  socket?: SocketIOClient.Socket;
  onDescriptionChange: (description: string) => void;
}
 
const TaskModal: React.FC<ITaskModalProps> = ({
  id,
  title,
  boardId,
  description,
  dateAdded,
  onModalClose,
  socket,
  onDescriptionChange,
}) => {
  const [desc, setDescription] = React.useState(description);
  const [descFocus, setDescFocus] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!descFocus) {
      setDescription(description)
    }
  }, [description, descFocus]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  return (
    <Modal centered={false} open={true} onClose={() => onModalClose()}>
      <Modal.Header>
        {title}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Default Profile Image</Header>
          <UserDropdownContainer
            name={'userId'}
            onSelectUser={(user: any) => console.log(user)}
            socket={socket}
          />
          <Input
            value={desc}
            onChange={handleDescriptionChange}
            onFocus={() => setDescFocus(true)}
            onBlur={() => setDescFocus(false)}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}
 
export default TaskModal;