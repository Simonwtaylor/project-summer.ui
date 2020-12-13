import * as React from 'react';
import { ISprint, ITask } from '../../lib';
import { TaskList, TaskModalContainer } from '../task';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCurrentSprint } from '../../redux/index';
import CurrentTaskDropdown from '../dropdowns/current-task-dropdown.container';
import { Grid, Icon, Label, Image } from 'semantic-ui-react';

export interface IUserDashboardContainerProps {
  socket?: SocketIOClient.Socket;
}
 
const UserDashboardContainer: React.FC<IUserDashboardContainerProps> = ({
  socket,
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [userTasks, setUserTasks] = React.useState<any[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [showTaskModal, setShowTaskModal] = React.useState(false);
  const handleCurrentTask = (task: any) => {
    socket?.emit('updateUserAssignedTask', { 
      userId: currentUser.id,
      taskId: task.value,
    });
  };

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
  }, [socket, showTaskModal]);

  const getUserProfile = () => {
    if (!currentUser) {
      return <></>;
    }

    return (
      <>
        <Image
          src={currentUser?.photoURL}
          circular={true}
          size={'tiny'}
          style={{
            width: '35px',
            display: 'inline-block',
            marginLeft: '7px',
          }}
        />
      </>
    );
  };

  const handleTaskModalClose = () => {
    console.log("Do Something...");
    setShowTaskModal(false);
  };

  const setupTaskModal = () => {
    socket?.emit('joinSprintRoom', { id: currentUser?.currentTask.sprintId });
    socket?.emit('getSprint', { id: currentUser?.currentTask.sprintId });

    socket?.on('sprint', (sprint: ISprint) => {
      dispatch(setCurrentSprint(sprint));
      setShowTaskModal(true);
    });
  };

  const getTaskModal = () => {
    if (showTaskModal) {
      return (
        <TaskModalContainer
          id={+currentUser?.currentTask.id}
          socket={socket}
          onClose={handleTaskModalClose}
          locationOnClose={'/home'}
        />
      );
    }
  };

  const getCurrentTask = () => {
    if (currentUser?.currentTask) {
      return (
        <Label
          as={'a'}
          color='teal'
          icon={true}
          //onClick={() => dispatch(setCurrentUser({ ...currentUser, currentTask: null }))}
          onClick={() => setupTaskModal()}
          style={{
            float: 'none',
            width: '100%',
            marginTop: '4px',
          }}
        >
          <Icon name={'check circle outline'} />
          {currentUser.currentTask.title}
        </Label>
      );
    }

    return (
      <CurrentTaskDropdown
        name={'taskId'}
        placeholder={'🤔 What are you working on?'}
        onSelectTask={handleCurrentTask}
        socket={socket}
        selectedTask={currentUser?.currentTask}
      />
    );
  };

  if (loaded) {
    return (
      <div className={'user dashboard'}>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column className={'title'} width={4}>
              {getUserProfile()}
              <span className={'greeting'}>Welcome {currentUser.displayName},</span>
            </Grid.Column>
            <Grid.Column width={currentUser?.currentTask ? 2 : 4}>
              {getCurrentTask()}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
            </Grid.Column>
            <Grid.Column>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <h4><span role="img">🎯</span> Assigned Tasks</h4>
              <TaskList tasks={userTasks} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {getTaskModal()}
      </div>
    );
  }

  return (
    <h3>Loading User Dashboard...</h3>
  );
}
 
export default UserDashboardContainer;