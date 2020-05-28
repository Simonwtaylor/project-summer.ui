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
  }, [socket, modalTask]);

  if (!modalTask) {
    return <span>loading...</span>
  }

  const handleModalClose = () => {
    socket?.emit('exitTaskRoom', { id });
    history.push('/sprint');
  };

  const handleDescriptionChange = (description: string) => {
    console.log(`task ${id} description changed to ${description}`)
    socket?.emit('updateTaskDescription', { taskId: id, description });
  };

  const handleUserChange = (user: any) => {
    console.log(`task ${id} user changed to ${user.displayName}`);
    socket?.emit('updateTaskUser', { taskId: id, userId: +user.id });
  };

  return (
    <TaskModal
      id={modalTask.id}
      description={modalTask.description}
      title={modalTask.title}
      dateAdded={modalTask.dateAdded}
      boardId={modalTask.boardId}
      user={modalTask.user}
      onModalClose={handleModalClose}
      socket={socket}
      onDescriptionChange={handleDescriptionChange}
      onUserChange={handleUserChange}
    />
  )
}
 
export default withRouter(TaskModalContainer);