import React, { useState, useEffect } from 'react';
import { Modal, Input, Popup, Image, Grid, Icon, Label } from 'semantic-ui-react';
import { UserDropdownContainer } from '../dropdowns';
import { IUser, IComment, IBoard } from '../../lib';
import Comments from '../comments/comments.component';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

export interface ITaskModalProps {
  id: string;
  title: string;
  boardId?: string;
  board?: IBoard;
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
  board,
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
  const [desc, setDescription] = useState(description);
  const [newTitle, setNewTitle] = useState(title);
  const [newStoryPoints, setNewStoryPoints] = useState(storyPoints);
  const [showDueDate, setShowDueDate] = useState(false);
  const [newDueDate, setNewDueDate] = useState<moment.Moment|null>(
    (dueDate) ? moment(dueDate) : null,
  );
  const [showPoints, setShowPoints] = useState(false);

  const [descFocus, setDescFocus] = useState<boolean>(false);
  const [titleFocus, setTitleFocus] = useState<boolean>(false);
  const [storyFocus, setStoryFocus] = useState<boolean>(false);
  const [changeUser, setChangeUser] = useState<boolean>(false);
  const [dueDateFocus, setDueDateFocus] = useState<boolean>(false);

  useEffect(() => {
    if (!descFocus) {
      setDescription(description);
    }
  }, [description, descFocus]);

  useEffect(() => {
    if (!titleFocus) {
      setNewTitle(title);
    }
  }, [title, titleFocus]);

  useEffect(() => {
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

  const getAssignedSprint = () => {
    if (board?.sprint) {
      return (
        <Label as='a' color={'grey'} image>
          <Icon color={'yellow'} name={'lightning'} />
          {board?.sprint.name}
        </Label>
      );
    }
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
    }
  };

  const getDueDateSection = () => {
    if (!showDueDate) {
      return <></>;
    }
    
    return (
      <Grid.Column>
        {getDueDate()}
      </Grid.Column>
    );
  };

  const getStoryPointsInput = () => {
    if (!showPoints) {
      return <></>;
    }

    return (
      <Grid.Column>
        <label>Story Points</label>
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
  };

  const calculatePoints = () => {
    return (
      <Popup
        content={'Click to change points'}
        key={`pointsleftsprinticon`}
        trigger={
          <Label
            as='a'
            color='teal'
            icon={true}
            onClick={() => setShowPoints(!showPoints)}
          >
            <Icon name={'gamepad'} />
            {storyPoints || 0}
          </Label>
        }
      />
    );
  };

  const getDueDateBadge = () => {
    if (!dueDate) { 
      return (
        <Popup
          content={'Click to set Due Date'}
          key={`pointsleftsprinticon`}
          trigger={
            <Label
              as='a'
              color='blue'
              icon={true}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowDueDate(!showDueDate)}
            >
              <Icon name={'calendar check'} />
              <Label.Detail>Due Date</Label.Detail>
            </Label>
          }
        />
      );
    }

    return (
      <Popup
        content={'Click to change Due Date'}
        key={`pointsleftsprinticon`}
        trigger={
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
        }
      />
    );
  };

  const getDueDatePointSection = () => {
    if (showPoints || showDueDate) {
      return (
        <Grid.Row columns={2}>
          {getDueDateSection()}
          {getStoryPointsInput()}
        </Grid.Row>
      );
    }
  };

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
        {getAssignedSprint()}
        {calculatePoints()}
        {getDueDateBadge()}
        {getCompleteTask()}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {getUserSection()}
          <Grid>
            {getDueDatePointSection()}
            <Grid.Row columns={2}>
              <Grid.Column>
                <label>Description</label>
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
