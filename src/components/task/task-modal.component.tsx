import * as React from 'react';
import { Modal, Input, Popup, Image, Grid, Icon, Label } from 'semantic-ui-react';
import { UserDropdownContainer } from '../dropdowns';
import { IUser, IComment } from '../../lib';
import Comments from '../comments/comments.component';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

export interface ITaskModalProps {
  id: string;
  title: string;
  boardId?: string;
  description?: string;
  completed?: boolean;
  dateAdded?: Date;
  dueDate?: Date;
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
  onDueDateChange: (dueDate?: Date) => void;
}

const TaskModal: React.FC<ITaskModalProps> = ({
  id,
  title,
  boardId,
  description,
  dateAdded,
  dueDate,
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
  onDueDateChange,
}) => {
  const [desc, setDescription] = React.useState(description);
  const [newTitle, setNewTitle] = React.useState(title);
  const [newStoryPoints, setNewStoryPoints] = React.useState(storyPoints);
  const [showDueDate, setShowDueDate] = React.useState(false);
  const [newDueDate, setNewDueDate] = React.useState<moment.Moment|null>(
    (dueDate) ? moment(dueDate) : null,
  );

  const [descFocus, setDescFocus] = React.useState<boolean>(false);
  const [titleFocus, setTitleFocus] = React.useState<boolean>(false);
  const [storyFocus, setStoryFocus] = React.useState<boolean>(false);
  const [changeUser, setChangeUser] = React.useState<boolean>(false);
  const [dueDateFocus, setDueDateFocus] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!descFocus) {
      setDescription(description);
    }
  }, [description, descFocus]);

  React.useEffect(() => {
    if (!titleFocus) {
      setNewTitle(title);
    }
  }, [title, titleFocus]);

  React.useEffect(() => {
    if (!storyFocus) {
      setNewStoryPoints(storyPoints);
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
          style={{ marginBottom: '10px' }}
        >
          <UserDropdownContainer
            name={'userId'}
            onSelectUser={onUserChange}
            socket={socket}
            selectedUser={user?.id}
            placeholder={'Please select a user'}
          />
        </div>
      );
    }

    return <></>;
  };

  const getDueDate = () => {
    if (showDueDate) {
      return(
        <div>
          <SingleDatePicker
            date={newDueDate}
            id={'duedate'}
            focused={dueDateFocus||showDueDate}
            onDateChange={(date: moment.Moment | null) => {
              setNewDueDate(date);
              setShowDueDate(false);
              onDueDateChange(date?.toDate());
            }}
            onFocusChange={({ focused }) => {
              return (focused) ? setDueDateFocus(true) : setDueDateFocus(false);
            }}
          />
        </div>
      );
    } else if (dueDate) {
      return (
        <Label
          as='a'
          color='blue'
          icon={true}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowDueDate(!showDueDate)}
        >
          <Icon name={'calendar check'} />
          <Label.Detail>Due {moment(dueDate).fromNow()}</Label.Detail>
        </Label>
      );
    } else {
      return (
        <Label
          as='a'
          color='blue'
          icon={true}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowDueDate(!showDueDate)}
        >
          <Icon name={'calendar check'} />
          <Label.Detail>Set Due Date</Label.Detail>
        </Label>
      );
    }
  };

  const getDueDateSection = () => {
    return (
      <Popup
        content={'Set Due Date'}
        key={`setduedatebutton`}
        trigger={
          <>
            {getDueDate()}
          </>
        }
      />
    );
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
      );
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
    );
  }

  return (
    <Modal centered={false} open={true} onClose={() => onModalClose()}>
      <Modal.Header
        style={{
          paddingTop: '1.5rem',
          paddingBottom: '1.75rem',
        }}
      >
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
                  display: 'inline-block',
                }}
              />
            }
          />)
        )}
        <Input
          style={{
            display: 'inline-block',
            marginLeft: '30px',
            border: 'none',
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
            <Grid.Row columns={1}>
              <Grid.Column>
                {getDueDateSection()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Input
                  value={desc}
                  onChange={handleDescriptionChange}
                  onFocus={() => setDescFocus(true)}
                  onBlur={() => setDescFocus(false)}
                  placeholder={'Description'}
                  style={{ width: '100%' }}
                  icon={'file alternate outline'}
                  iconPosition={'left'}
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
                  style={{ width: '100%' }}
                  icon='gamepad'
                  iconPosition='left'
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
};

export default TaskModal;
