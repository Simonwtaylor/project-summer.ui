import * as React from 'react';
import { DateService, ITask } from '../../lib';
import { Icon, Label, Table } from 'semantic-ui-react';
import moment from 'moment';

export interface TaskListProps {
  tasks: ITask[];
  onTaskClick: (taskId: number, sprintId: number) => void;
}

const taskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskClick,
}) => {
  return (
    <>
      <div className={'task list'}>
        <Table selectable={true} basic='very' style={{ }}>
          <Table.Header style={{ color: 'white' }}>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Due Date</Table.HeaderCell>
              <Table.HeaderCell>Sprint</Table.HeaderCell>
              <Table.HeaderCell>Points</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {tasks.map((task: ITask) => {
            return (
              <Table.Row onClick={() => onTaskClick(+task.id, task.board?.sprintId || 0)} key={`userdashboardtask${task.id}`}>
                <Table.Cell>{task.title}</Table.Cell>
                <Table.Cell>{(task.dueDate) ? moment(task.dueDate).fromNow() : ''}</Table.Cell>
                <Table.Cell>
                  {(task.board?.sprint) ? 
                    (<Label as='a' color={'grey'} image>
                      <Icon color={'yellow'} name={'lightning'} />
                      {task.board?.sprint.name}
                    </Label>
                    ) : ''}
                </Table.Cell>
                <Table.Cell>{task.storyPoints}</Table.Cell>
              </Table.Row>
            );
          })}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default taskList;
