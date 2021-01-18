import * as React from 'react';
import { ITask } from '../../lib';
import { Table } from 'semantic-ui-react';
import TaskListRowContainer from './task-list-row.container';

export interface TaskListProps {
  tasks: ITask[];
  socket?: SocketIOClient.Socket;
}

const taskList: React.FC<TaskListProps> = ({
  tasks,
  socket,
}) => {
  return (
    <>
      <div className={'task list'}>
        <Table selectable={true} basic='very' style={{ }}>
          <Table.Header style={{ color: 'white' }}>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Due Date</Table.HeaderCell>
              <Table.HeaderCell>Sprint</Table.HeaderCell>
              <Table.HeaderCell>Points</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {tasks.map((task: ITask) => {
            return (
              <TaskListRowContainer task={task} socket={socket} />
            );
          })}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default taskList;
