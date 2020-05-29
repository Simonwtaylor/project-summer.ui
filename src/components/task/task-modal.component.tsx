import * as React from 'react';
import { Modal, Input, Popup, Image, Comment, Header, Form, Button, Grid } from 'semantic-ui-react';
import { UserDropdownContainer } from '../dropdowns';
import { IUser, IComment } from '../../lib';
import moment from 'moment';

export interface ITaskModalProps {
  id: string;
  title: string;
  boardId?: string;
  description?: string;
  dateAdded?: Date;
  user?: IUser;
  comments: IComment[];
  onModalClose: () => void;
  socket?: SocketIOClient.Socket;
  onDescriptionChange: (description: string) => void;
  onUserChange: (user: any) => void;
  onTitleChange: (title: string) => void;
  onCommentAdd: (content: string) => void;
}
 
const TaskModal: React.FC<ITaskModalProps> = ({
  id,
  title,
  boardId,
  description,
  dateAdded,
  user,
  comments,
  onModalClose,
  socket,
  onDescriptionChange,
  onUserChange,
  onTitleChange,
  onCommentAdd,
}) => {
  const [desc, setDescription] = React.useState(description);
  const [newTitle, setNewTitle] = React.useState(title);
  const [content, setContent] = React.useState('');
  const [descFocus, setDescFocus] = React.useState<boolean>(false);
  const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
    onTitleChange(e.target.value);
  };

  const handleCommentSubmit = () => {
    onCommentAdd(content);
    setContent('');
  }

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
                
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Comment.Group>
            <Header as='h3' dividing>
              Comments
            </Header>
            {
              (comments.map((comment: IComment) => {
                return (
                  <Comment>
                    <Comment.Avatar src={comment.user?.photoURL} />
                    <Comment.Content>
                      <Comment.Author as='a'>{comment.user?.displayName}</Comment.Author>
                      <Comment.Metadata>
                        <div>{moment(comment.datePosted).calendar()}</div>
                      </Comment.Metadata>
                      <Comment.Text>{comment.content}</Comment.Text>
                      <Comment.Actions>
                        <Comment.Action>Reply</Comment.Action>
                      </Comment.Actions>
                    </Comment.Content>
                  </Comment>
                )
              }))
            }
            <Form reply>
              <Form.TextArea
                value={content}
                onChange={
                  (event: React.FormEvent<HTMLTextAreaElement>) => setContent(event.currentTarget.value)
                }
              />
              <Button
                onClick={handleCommentSubmit}                
                labelPosition='left'
                icon='edit'
                primary
                content={'Add Comment'}
              />
            </Form>
          </Comment.Group>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}
 
export default TaskModal;