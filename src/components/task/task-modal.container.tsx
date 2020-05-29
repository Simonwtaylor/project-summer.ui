import React from 'react';
import { default as TaskModal } from './task-modal.component';
import { ITask } from '../../lib/types';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/user.selector';

export interface ITaskModalContainerProps extends RouteComponentProps {
  id: number;
  socket?: SocketIOClient.Socket;
  onClose: () => void;
}
 
const TaskModalContainer: React.FC<ITaskModalContainerProps> = ({
  id,
  socket,
  history,
  onClose,
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const [modalTask, setModalTask] = React.useState<ITask|undefined>(undefined);

  React.useEffect(() => {
    if (socket) {
      socket.emit('joinTaskRoom', { id });
      socket.emit('getTask', { id });
    }
  }, [socket, id]);

  React.useEffect(() => {
    socket?.on('task', (task: ITask) => {
      console.log(task);
      setModalTask(task);
    });
  }, [socket, modalTask]);

  if (!modalTask) {
    return <span>loading...</span>
  }

  const handleModalClose = () => {
    socket?.emit('exitTaskRoom', { id });
    onClose();
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

  const handleTitleChange = (title: string) => {
    console.log(`task ${id} title changed to ${title}`)
    socket?.emit('updateTaskTitle', { taskId: id, title });
  };

  const handleCommentAdd = (content: string) => {
    console.log(`task ${id} title has comment added to`)
    socket?.emit('addComment', { taskId: id, content, uid: currentUser.uid });
  };

  return (
    <TaskModal
      {...modalTask}
      onModalClose={handleModalClose}
      socket={socket}
      onDescriptionChange={handleDescriptionChange}
      onUserChange={handleUserChange}
      onTitleChange={handleTitleChange}
      onCommentAdd={handleCommentAdd}
    />
  )
}
 
export default withRouter(TaskModalContainer);