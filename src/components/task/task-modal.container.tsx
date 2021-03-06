import React from 'react';
import { default as TaskModal } from './task-modal.component';
import { ITask } from '../../lib/types';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentSprint } from '../../redux/index';

export interface ITaskModalContainerProps extends RouteComponentProps {
  id: number;
  socket?: SocketIOClient.Socket;
  onClose: () => void;
  locationOnClose?: string;
  sprintId?: number,
}

const TaskModalContainer: React.FC<ITaskModalContainerProps> = ({
  id,
  socket,
  history,
  onClose,
  locationOnClose,
  sprintId,
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const currentSprint = useSelector(selectCurrentSprint);
  if (currentSprint && !sprintId) sprintId = currentSprint.id;
  const [modalTask, setModalTask] = React.useState<ITask|undefined>(undefined);

  React.useEffect(() => {
    if (socket && id) {
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
    onClose();
    history.push(locationOnClose || '/sprint');
  };

  const handleDescriptionChange = (description: string) => {
    console.log(`task ${id} description changed to ${description}`);
    socket?.emit('updateTaskDescription', { taskId: id, description });
  };

  const handleUserChange = (user: any) => {
    console.log(`task ${id} user changed to ${user.text}`);
    socket?.emit('updateTaskUser', { taskId: id, userId: +user.value });
  };

  const handleTitleChange = (title: string) => {
    console.log(`task ${id} title changed to ${title}`)
    socket?.emit('updateTaskTitle', { taskId: id, title });
  };

  const handleCommentAdd = (content: string) => {
    console.log(`task ${id} title has comment added to`);
    socket?.emit('addCommentToTask', { taskId: id, content, uid: currentUser.uid });
  };

  const handleStoryPointsChange = (storyPoints: number) => {
    console.log(`task ${id} story points changed to ${storyPoints}`);
    socket?.emit('updateTaskStoryPoints', { taskId: id, storyPoints });
  };

  const handleCompleteChange = () => {
    console.log(`task ${id} complete change`);
    socket?.emit('updateTaskComplete', { taskId: id, sprintId });
  };

  const handleDueDateChange = (dueDate?: Date) => {
    console.log(`task ${id} complete change`);
    socket?.emit('updateTaskDueDate', { taskId: id, sprintId, dueDate });
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
      onStoryPointsChange={handleStoryPointsChange}
      onCompleteChange={handleCompleteChange}
      onDueDateChange={handleDueDateChange}
    />
  );
};

export default withRouter(TaskModalContainer);
