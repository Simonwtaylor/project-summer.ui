import * as React from 'react';
import { Icon, Label, Popup, Table } from 'semantic-ui-react';
import { IBoard } from '../../lib';
import moment from 'moment';

export interface ITaskListRowProps {
  id: string;
  title?: string;
  dueDate?: Date;
  board?: IBoard;
  storyPoints?: number;
  completed?: boolean;
  onTaskClick: (taskId: number, sprintId: number) => void;
  onCompleteChange: () => void;
}
 
const TaskListRow: React.FC<ITaskListRowProps> = ({
  id,
  title,
  dueDate,
  board,
  storyPoints,
  completed,
  onTaskClick,
  onCompleteChange,
}) => {

  const getCompleteTask = () => {
    const styles = {
      cursor: 'pointer',
      float: 'right',
      fontSize: '1.2rem',
    };

    if (!completed) {
      return (
        <Popup
          content={'Complete Task'}
          key={`completetaskbutton`}
          trigger={
            <Icon
              name={'check circle outline'}
              color={'green'}
              style={styles}
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
            style={styles}
            onClick={onCompleteChange}
          />
        }
      />
    );
  };

  return (
    <Table.Row onClick={() => onTaskClick(+id, board?.sprintId || 0)} key={`userdashboardtask${id}`}>
      <Table.Cell>{getCompleteTask()}</Table.Cell>
      <Table.Cell>{title}</Table.Cell>
      <Table.Cell>{(dueDate) ? moment(dueDate).fromNow() : ''}</Table.Cell>
      <Table.Cell>
        {(board?.sprint) ? 
          (<Label as='a' color={'grey'} image>
            <Icon color={'yellow'} name={'lightning'} />
            {board?.sprint.name}
          </Label>
          ) : ''}
      </Table.Cell>
      <Table.Cell>{storyPoints}</Table.Cell>
   </Table.Row>
  );
}
 
export default TaskListRow;