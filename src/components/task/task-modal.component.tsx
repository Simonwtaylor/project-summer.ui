import * as React from 'react';
import { Modal, Input, Popup, Image, Grid, Icon } from 'semantic-ui-react';
import { UserDropdownContainer } from '../dropdowns';
import { IUser, IComment } from '../../lib';
import Comments from '../comments/comments.component';

export interface ITaskModalProps {
  id: string;
  title: string;
  boardId?: string;
  description?: string;
  completed?: boolean;
  dateAdded?: Date;
  storyPoints?: number;
  user?: IUser;
  comments: IComment[];
  onModalClose: () => void;
  socket?: SocketIOClient.Socket;
  onDescriptionChange: (description: string) => void;
  onUserChange: (user: any) => void;
  onTitleChange: (title: string) => void;
  onCommentAdd: (content: string) => void;
  onStoryPointsChange: (storyPoints: number) => void;
  onCompleteChange: () => void;
}
 
const TaskModal: React.FC<ITaskModalProps> = ({
  id,
  title,
  boardId,
  description,
  dateAdded,
  completed,
  storyPoints,
  user,
  comments,
  onModalClose,
  socket,
  onDescriptionChange,
  onUserChange,
  onTitleChange,
  onCommentAdd,
  onStoryPointsChange,
  onCompleteChange,
}) => {
  const [desc, setDescription] = React.useState(description);
  const [newTitle, setNewTitle] = React.useState(title);
  const [newStoryPoints, setNewStoryPoints] = React.useState(storyPoints);

  const [descFocus, setDescFocus] = React.useState<boolean>(false);
  const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
  const [storyFocus, setStoryFocus] = React.useState<boolean>(false);
  const [changeUser, setChangeUser] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!descFocus) {
      setDescription(description)
    }
  }, [description, descFocus]);

  React.useEffect(() => {
    if (!titleFocus) {
      setNewTitle(title)
    }
  }, [title, titleFocus]);

  React.useEffect(() => {
    if (!storyFocus) {
      setNewStoryPoints(storyPoints)
    }
  }, [storyPoints, storyFocus]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
    onTitleChange(e.target.value);
  };

  const handleStoryPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStoryPoints(+e.target.value);
    onStoryPointsChange(+e.target.value);
  };

  const handleCommentSubmit = (content: string) => {
    onCommentAdd(content);
  };

  const getUserSection = () => {
    if (!user || changeUser) {
      return (
        <div
          style={{
            marginBottom: '10px'
          }}
        >
          <UserDropdownContainer
            name={'userId'}
            onSelectUser={onUserChange}
            socket={socket}
            selectedUser={user?.id}
            placeholder={'Please select a user'}
          />
        </div>
      )
    }

    return <></>;
  };

  const getCompleteTask = () => {
    if (!completed) {
      return (
        <Popup
          content={'Complete Task'}
          key={`completetaskbutton`}
          trigger={
            <Icon
              name={'check circle outline'}
              color={'green'}
              style={{
                cursor: 'pointer',
                float: 'right',
                marginTop: '10px',
              }}
              onClick={onCompleteChange}
            />
          }
        />
      )
    }

    return (
      <Popup
        content={'Mark Task as Incomplete'}
        key={`incompletetaskbutton`}
        trigger={
          <Icon
            name={'check circle'}
            color={'green'}
            style={{
              cursor: 'pointer',
              float: 'right',
              marginTop: '10px',
            }}
            onClick={onCompleteChange}
          />
        }
      />
    )
  }

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
        <Input
          style={{
            display: 'inline-block',
            marginLeft: '30px',
            border: 'none'
          }}
          onChange={handleTitleChange}
          onFocus={() => setTitleFocus(true)}
          placeholder={'Title'}
          onBlur={() => setTitleFocus(false)}
          value={newTitle}
          transparent={true}
        />
        {getCompleteTask()}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {getUserSection()}
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Input
                  value={desc}
                  onChange={handleDescriptionChange}
                  onFocus={() => setDescFocus(true)}
                  onBlur={() => setDescFocus(false)}
                  placeholder={'Description'}
                  style={{
                    width: '100%'
                  }}
                />
              </Grid.Column>
              <Grid.Column>
                <Input
                  value={newStoryPoints}
                  onChange={handleStoryPointsChange}
                  onFocus={() => setStoryFocus(true)}
                  onBlur={() => setStoryFocus(false)}
                  placeholder={'Story Points'}
                  type={'number'}
                  style={{
                    width: '100%'
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Comments
            comments={comments}
            onCommentSubmit={handleCommentSubmit}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}
 
export default TaskModal;