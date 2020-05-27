import * as React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ITask } from '../../lib';
import { Grid, Icon, Input } from 'semantic-ui-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

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
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    border: isDraggingOver ? '1px dotted grey' : '',
    padding: 8,
    width: 250
  });

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 8 * 2,
    margin: `0 0 ${8}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '',

    // styles we need to apply on draggables
    ...draggableStyle
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
        <Icon
          name={'plus'}
          style={{
            cursor: 'pointer',
            color: 'green',
            marginLeft: '10px'
          }}
          onClick={() => setNewTask(!newTask)}
        />
      )
    }

    return (
      <>
        <Icon
          name={'save'}
          style={{
            cursor: 'pointer',
            color: 'green',
            marginLeft: '10px'
          }}
          onClick={onSaveClick}
        />
        <Icon
          name={'cancel'}
          style={{
            cursor: 'pointer',
            color: 'red',
            marginLeft: '10px'
          }}
          onClick={onCancelClick}
        />
      </>
    )
  };

  return (
    <Grid.Column key={`sprintboard${droppableId}`}>
      <div>
        <span style={{color: 'white'}}>{name}</span>
        {getColumnActions()}
      </div>
      {getNewTaskInput()}
      <Droppable droppableId={droppableId}>
        {(provided: any, snapshot: any) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}>
            {items.map((item: ITask, index: any) => (
              <Draggable
                key={item.id}
                draggableId={`${item.id}`}
                index={index}>
                {(provided: any, snapshot: any) => (
                  <div
                    onClick={() => history.push(`/sprint/${item.id}`)}
                    className={'card ui'}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}>
                    {item.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Grid.Column>
  );
}
 
export default withRouter(BoardColumn);