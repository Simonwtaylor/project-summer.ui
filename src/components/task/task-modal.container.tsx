import React from 'react';
import { default as TaskModal } from './task-modal.component';
import { ITask } from '../../lib/types';
import { withRouter, RouteComponentProps } from 'react-router-dom';

export interface ITaskModalContainerProps extends RouteComponentProps {
  id: number;
  socket?: SocketIOClient.Socket;
}
 
const TaskModalContainer: React.FC<ITaskModalContainerProps> = ({
  id,
  socket,
  history,
}) => {
  const [modalTask, setModalTask] = React.useState<ITask|undefined>(undefined);

  React.useEffect(() => {
    if (socket) {
      socket.emit('joinTaskRoom', { id });
      socket.emit('getTask', { id });
    }
  }, [socket, id]);

  React.useEffect(() => {
    socket?.on('task', (task: ITask) => {
      setModalTask(task);
    });
  }, [socket]);

  if (!modalTask) {
    return <span>loading...</span>
  }

  const handleModalClose = () => {
    socket?.emit('exitTaskRoom', { id });
    history.push('/sprint');
  };

  return (
    <TaskModal
      task={modalTask}
      onModalClose={handleModalClose}
      socket={socket}
    />
  )
}
 
export default withRouter(TaskModalContainer);