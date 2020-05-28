import * as React from 'react';
import { Modal, Input, Popup, Image } from 'semantic-ui-react';
import { UserDropdownContainer } from '../dropdowns';
import { IUser } from '../../lib';

export interface ITaskModalProps {
  id: string;
  title: string;
  boardId?: string;
  description?: string;
  dateAdded?: Date;
  user?: IUser;
  onModalClose: () => void;
  socket?: SocketIOClient.Socket;
  onDescriptionChange: (description: string) => void;
  onUserChange: (user: any) => void;
}
 
const TaskModal: React.FC<ITaskModalProps> = ({
  id,
  title,
  boardId,
  description,
  dateAdded,
  user,
  onModalClose,
  socket,
  onDescriptionChange,
  onUserChange
}) => {
  const [desc, setDescription] = React.useState(description);
  const [descFocus, setDescFocus] = React.useState<boolean>(false);
  const [changeUser, setChangeUser] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!descFocus) {
      setDescription(description)
    }
  }, [description, descFocus]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  const getUserSection = () => {
    if (!user || changeUser) {
      return (
        <UserDropdownContainer
          name={'userId'}
          onSelectUser={onUserChange}
          socket={socket}
          selectedUser={user?.id}
        />
      )
    }

    return <></>;
  };

  return (
    <Modal centered={false} open={true} onClose={() => onModalClose()}>
      <Modal.Header>
        {(user && (
          <Popup
            content={user.displayName}
            key={`taskuserphoto`}
            trigger={
              <Image
                src={user.photoURL}
                circular={true}
                onClick={() => setChangeUser(!changeUser)}
                size={'tiny'}
                style={{
                  width: '45px',
                  display: 'inline-block'
                }}
              />
            }
          />)
        )}
        <span
          style={{
            display: 'inline-block',
            marginLeft: '30px'
          }}
        >
          {title}
        </span>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {getUserSection()}
          <Input
            value={desc}
            onChange={handleDescriptionChange}
            onFocus={() => setDescFocus(true)}
            onBlur={() => setDescFocus(false)}
            style={{
              width: '100%'
            }}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}
 
export default TaskModal;