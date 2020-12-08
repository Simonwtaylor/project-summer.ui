import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { ITask } from '../../lib';
import { Grid, Icon, Input, Popup, Label } from 'semantic-ui-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import TaskCard from '../task/task-card.component'

export interface IBoardColumnProps extends RouteComponentProps {
  name: string;
  droppableId: string;
  items: ITask[];
  onAddNewTask: (title: string, boardId: number) => void;
}

const BoardColumn: React.FC<IBoardColumnProps> = ({
  name,
  droppableId,
  items,
  onAddNewTask,
  history,
}) => {

  const [newTask, setNewTask] = React.useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState<string>('');
  
  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'none',
    border: isDraggingOver ? '1px dotted grey' : '',
    padding: 8,
    width: 300,
    maxHeight: '75vh',
  });

  const getNewTaskInput = () => {
    if (newTask) {
      return (
        <Input
          value={newTaskTitle}
          onChange={
            (e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)
          }
        />
      )
    }

    return <></>;
  };

  const onSaveClick = () => {
    onAddNewTask(newTaskTitle, +droppableId);
    setNewTaskTitle('');
    setNewTask(false);
  };
  
  const onCancelClick = () => {
    setNewTaskTitle('');
    setNewTask(false);
  }

  const getColumnActions = () => {
    if (!newTask) {
      return (
        <Popup
          content={`Add task to ${name}`}
          key={`addtasktosprint${name}`}
          trigger={
            <Icon
              name={'plus'}
              style={{
                cursor: 'pointer',
                color: 'green',
                marginLeft: '10px',
              }}
              onClick={() => setNewTask(!newTask)}
            />
          }
        />
      )
    }

    return (
      <>
        <Popup
          content={`Save task to ${name}`}
          key={`savetasktosprint${name}`}
          trigger={
            <Icon
              name={'save'}
              style={{
                cursor: 'pointer',
                color: 'green',
                marginLeft: '10px'
              }}
              onClick={onSaveClick}
            />
          }
        />
        <Popup
          content={`Cancel`}
          key={`canceltasktosprint${name}`}
          trigger={
            <Icon
              name={'cancel'}
              style={{
                cursor: 'pointer',
                color: 'red',
                marginLeft: '10px'
              }}
              onClick={onCancelClick}
            />
          }
        />
      </>
    )
  };

  const getColumnTags = () => {
    let points = 0;

    items
        .filter(a => !a.completed)
        .forEach((task: ITask) => points += task.storyPoints || 0);

    return (
      <>
        <Popup
          content={`${items.length} task(s) in ${name}`}
          key={`numberoftasksin${name}`}
          trigger={
            <Label as='a' color='orange'>
              {items.length}
            </Label>
          }
        />
        <Popup
          content={`${points} point(s) in ${name}`}
          key={`numberofpointsin${name}`}
          trigger={
            <Label as='a' color='teal'>
              {points}
            </Label>
          }
        />
      </>
    )
  };

  return (
    <Grid.Column key={`sprintboard${droppableId}`}>
      <div
        style={{
          marginTop: '5px',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            paddingLeft: '8px',
            color: 'white',
            fontSize: '1.3em',
          }}
        >
          <b>{name}</b>
        </span>
        {getColumnActions()}
        {getColumnTags()}
      </div>
      {getNewTaskInput()}
      <Droppable droppableId={droppableId}>
        {(provided: any, snapshot: any) => (
          <div
            ref={provided.innerRef}
            className={'board col draggable'}
            style={getListStyle(snapshot.isDraggingOver)}>
            {items.map((item: ITask, index: any) => (
              <TaskCard
                task={item}
                index={index}
                onCardClick={() => history.push(`/sprint/${item.id}`)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Grid.Column>
  );
}

export default withRouter(BoardColumn);
