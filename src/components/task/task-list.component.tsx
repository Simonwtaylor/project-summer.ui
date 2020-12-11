import * as React from 'react';
import { ITask } from '../../lib';

export interface TaskListProps {
  tasks: ITask[];
}

const taskList: React.FC<TaskListProps> = ({
  tasks,
}) => {
  return (
    <>
      <h3>
        Task Lists
      </h3>
      <div>
        <ul>
          {tasks.map((task: ITask) => {
            return (<li key={`userdashboardtask${task.id}`}>{task.title}</li>)
          })}
        </ul>
      </div>
    </>
  );
};

export default taskList;
