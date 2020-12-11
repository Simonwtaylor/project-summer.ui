import * as React from 'react';
import { Menu, Icon, Image, Label } from 'semantic-ui-react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '../../redux/index';
import CurrentTaskDropdown from '../dropdowns/current-task-dropdown.container';

export interface NavbarProps extends RouteComponentProps<any> {
  onMenuToggle: () => void;
  socket?: SocketIOClient.Socket;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
  socket,
  history,
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleCurrentTask = (task: any) => {
    socket?.emit('updateUserAssignedTask', { 
      userId: currentUser.id,
      taskId: task.value,
    });
  };

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
            width: '70px',
            display: 'inline-block',
            marginLeft: '7px',
          }}
          onClick={() => history.push('/home')}
        />
      </>
    );
  };

  const getCurrentTask = () => {
    if (currentUser?.currentTask) {
      return (
        <Label
          as={'a'}
          color='teal'
          icon={true}
          onClick={() => dispatch(setCurrentUser({ ...currentUser, currentTask: null }))}
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
        placeholder={'Select Current Task'}
        onSelectTask={handleCurrentTask}
        socket={socket}
        selectedTask={currentUser?.currentTask}
      />
    );
  };

  return (
    <Menu
      stackable
      className={'navbar'}
      style={{
        backgroundColor: '#2f3136',
        borderRadius: '0px',
        marginBottom: '0',
        minHeight: '70px',
      }}
    >
      <Menu.Item
        as={ Link }
        to='#'
        name=''
        onClick={() => onMenuToggle()}
      >
        <Icon name={'bars'} style={{ color: 'white'}} />
      </Menu.Item>
      <Menu.Item
        position={'right'}
      >
      </Menu.Item>
      <Menu.Item
        position={'right'}
      >
        {getCurrentTask()}
        {getUserProfile()}
      </Menu.Item>
    </Menu>
  );
};

export default withRouter(Navbar);
