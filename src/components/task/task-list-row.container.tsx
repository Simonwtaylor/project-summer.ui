import * as React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ITask } from '../../lib';
import TaskListRow from './task-list-row.component';
import { selectCurrentSprint } from '../../redux/index';

export interface ITaskListRowContainerProps extends RouteComponentProps {
  task: ITask;
  socket?: SocketIOClient.Socket;
}
 
const TaskListRowContainer: React.FC<ITaskListRowContainerProps> = ({
  task,
  socket,
  history,
}) => {

  const currentSprint = useSelector(selectCurrentSprint);
  
  const handleUserTaskClick = (taskId: number, sprintId: number) => {
    history.push(`sprint/${taskId}`);
  };

  const handleCompleteChange = () => {
    console.log(`task ${task.id} complete change`);
    socket?.emit('updateTaskComplete', { taskId: task.id, sprintId: currentSprint.id });
  };

  return (
    <TaskListRow
      {...task}
      onTaskClick={handleUserTaskClick}
      onCompleteChange={handleCompleteChange}
    />
  );
}
 
export default withRouter(TaskListRowContainer);