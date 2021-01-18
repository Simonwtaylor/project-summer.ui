import * as React from 'react';
import { ITask } from '../../lib';
import { TaskList, TaskModalContainer } from '../task';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/index';
import CurrentTaskDropdown from '../dropdowns/current-task-dropdown.container';
import { Grid, Icon, Label, Image } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export interface IUserDashboardContainerProps extends RouteComponentProps<any>  {
  socket?: SocketIOClient.Socket;
}
 
const UserDashboardContainer: React.FC<IUserDashboardContainerProps> = ({
  socket,
  history,
}) => {
  const currentUser = useSelector(selectCurrentUser);
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
    if (socket && currentUser?.roomJoined) {
      socket.emit('joinUserDashboardRoom');
      socket.emit('getUserDashboard');
      socket.on('userDashboard', ({ tasks }: { tasks: ITask[] }) => {
        console.log(tasks);
        setUserTasks(tasks);
        setLoaded(true);
      });
    }
    return () => {
      socket?.emit('exitUserDashboardRoom')
    }
  }, [socket, showTaskModal, currentUser]);

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
    setShowTaskModal(true);
  };

  const getTaskModal = (taskId?: number, sprintId?: number) => {
    if (showTaskModal) {
      return (
        <TaskModalContainer
          id={taskId || +currentUser?.currentTask.id}
          socket={socket}
          onClose={handleTaskModalClose}
          locationOnClose={'/home'}
          sprintId={sprintId || currentUser?.currentTask.sprintId}
        />
      );
    }
  };

  const getCurrentTask = () => {
    if (currentUser?.currentTask?.id) {
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
        selectedTask={
          (currentUser && Object.keys(currentUser?.currentTask).length > 0) ?
          currentUser?.currentTask : undefined
        }
      />
    );
  };

  const handleUserTaskClick = (taskId: number, sprintId: number) => {
    setShowTaskModal(true);
    history.push(`sprint/${taskId}`);
  };

  const getWidth = () => {
    if (currentUser && currentUser?.currentTask?.id) {
      return 2;
    }
    
    return 4;
  }

  if (loaded) {
    return (
      <div className={'user dashboard'}>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column className={'title'} width={4}>
              {getUserProfile()}
              <span className={'greeting'}>Welcome {currentUser.displayName},</span>
            </Grid.Column>
            <Grid.Column width={getWidth()}>
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
            <Grid.Column className={'table'}>
              <h3><span role="img">🎯</span> Assigned Tasks</h3>
              <TaskList tasks={userTasks} socket={socket} />
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
 
export default withRouter(UserDashboardContainer);