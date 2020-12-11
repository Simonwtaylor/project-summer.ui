import * as React from 'react';
import { ITask } from '../../lib';
import { TaskList } from '../task';

export interface IUserDashboardContainerProps {
  socket?: SocketIOClient.Socket;
}
 
const UserDashboardContainer: React.FC<IUserDashboardContainerProps> = ({
  socket,
}) => {
  const [userTasks, setUserTasks] = React.useState<any[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    if (socket) {
      socket.emit('joinUserDashboardRoom');
      socket.emit('getUserDashboard');
      socket.on('userDashboard', ({ tasks }: { tasks: ITask[] }) => {
        setUserTasks(tasks);
        setLoaded(true);
      });
    }
    return () => {
      socket?.emit('exitUserDashboardRoom')
    }
  }, [socket]);

  if (loaded) {
    return (
      <TaskList tasks={userTasks} />
    )
  }

  return (
    <h3>Loading User Dashboard...</h3>
  );
}
 
export default UserDashboardContainer;