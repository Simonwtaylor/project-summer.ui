import * as React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ITask } from '../../lib';
import { Grid, Icon, Input, Popup, Image, Label } from 'semantic-ui-react';
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
    width: 250,
    maxHeight: '75vh',
  });

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    userSelect: 'none',
    padding: 8 * 2,
    margin: `0 0 ${8}px 0`,
    background: isDragging ? 'lightgreen' : '',
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
        <Popup
          content={`Add task to ${name}`}
          key={`addtasktosprint${name}`}
          trigger={
            <Icon
              name={'plus'}
              style={{
                cursor: 'pointer',
                color: 'green',
                marginLeft: '10px'
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
              <Draggable
                key={item.id}
                draggableId={`${item.id}`}
                index={index}>
                {(provided: any, snapshot: any) => (
                  <div
                    onClick={() => history.push(`/sprint/${item.id}`)}
                    className={`card ui ${
                      item.completed ? 'green' : ''
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}>
                      <Grid>
                        <Grid.Row columns={3}>
                          <Grid.Column
                            width={4}

                          >
                            {(item.user && (
                              <Popup
                                content={item.user.displayName}
                                key={`taskuserphoto`}
                                trigger={
                                  <Image
                                    src={item.user.photoURL}
                                    circular={true}
                                    size={'tiny'}
                                    style={{
                                      width: '30px',
                                    }}
                                  />
                                }
                              />)
                            )}
                          </Grid.Column>
                          <Grid.Column
                            width={9}
                          >
                            <span
                              style={{
                                verticalAlign: 'center'
                              }}
                            >
                              {item.title}
                            </span>
                          </Grid.Column>
                          <Grid.Column width={3}>
                            <Label
                              size={'tiny'}
                              color={'teal'}
                              circular={true}
                            >
                              {item.storyPoints || '?'}
                            </Label>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
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