import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { ITask } from '../../lib';
import { Grid, Input } from 'semantic-ui-react';
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
  
  const getEmoji = (name: string) => {
    const styles = {
      marginRight: '7px',
      fontSize: '1.2rem',
    };

    switch (name) {
      case "Backlog":
        return <span style={styles}>🗃</span>;
      case "In Progress":
        return <span style={styles}>🔥</span>;
      case "Completed":
        return <span style={styles}>🎉</span>;
    }
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
            fontSize: '1.3em',
          }}
        >
          {getEmoji(name)}
          <b>{name}</b>
        </span>
        {getColumnActions()}
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
