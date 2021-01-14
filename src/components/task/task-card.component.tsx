import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ITask } from '../../lib';
import { Grid, Popup, Image, Label } from 'semantic-ui-react';
import moment from 'moment';

export interface ITaskCardProps {
  task: ITask;
  index: number;
  onCardClick: (id: number) => void;
}

const TaskCard: React.FC<ITaskCardProps> = ({
  task,
  index,
  onCardClick,
}) => {
  const {
    id,
    completed,
    user,
    title,
    storyPoints,
    dueDate,
  } = task;

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    userSelect: 'none',
    padding: 8 * 2,
    margin: `0 0 ${8}px 0`,
    background: isDragging ? '' : '',
    border: isDragging ? '1px solid lightblue' : '',
    ...draggableStyle,
  });

  const getDueDate = () => {
    if (dueDate) {
      return (
        <span>{moment(dueDate).format("Do MMM")}</span>
      );
    } 

    return <></>;
  }

  return (
    <Draggable
      key={id}
      draggableId={`${id}`}
      index={index}>
      {(provided: any, snapshot: any) => (
        <div
          onClick={() => onCardClick(+id)}
          className={`card ui ${completed ? 'green' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style,
          )}>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column width={13}>
                  <span style={{verticalAlign: 'center'}}>
                    {title}
                  </span>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Label
                    size={'tiny'}
                    color={'teal'}
                    circular={true}
                  >
                    {storyPoints || '?'}
                  </Label>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Column width={4}>
                  {(user && (
                    <Popup
                      content={user.displayName}
                      key={`taskuserphoto`}
                      trigger={
                        <Image
                          src={user.photoURL}
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
                <Grid.Column width={5}>
                </Grid.Column>
                <Grid.Column
                  width={7}
                  style={{
                    textAlign: 'right',
                  }}
                >
                  {getDueDate()}
                </Grid.Column>
              </Grid.Row>
            </Grid>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
