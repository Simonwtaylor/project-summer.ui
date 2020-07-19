import * as React from 'react';
import { Sidebar, Menu, Icon, Popup, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { SprintSelector } from '../sprint/index';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentSprint } from '../../redux/sprint/sprint.selector';
import { selectCurrentUser } from '../../redux/user/user.selector';
import { CurrentTaskDropdown } from '../dropdowns';
import { setCurrentUser } from '../../redux/user/user.action';
import AddSprint from '../sprint/add-sprint.component';

export interface INavSidebarProps {
  socket?: SocketIOClient.Socket;
  visible: boolean;
  onSprintChange: (prevSprintId: number) => void;
}
 
const NavSidebar: React.FC<INavSidebarProps> = ({
  socket,
  visible,
  onSprintChange,
}) => {

  const currentSprint = useSelector(selectCurrentSprint);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const [addSprint, setAddSprint] = React.useState(false);

  const handleCurrentTask = (task: any) => {
    console.log(task);
    socket?.emit('updateUserAssignedTask', { 
      userId: currentUser.id,
      taskId: task.value,
    });
  };

  const handleAddSprint = (sprint: any) => {
    console.log(sprint);
    socket?.emit('addSprint', { 
      ...sprint,
    });
  };

  if (currentUser) {
    socket?.on('user', (user: any) => {
      dispatch(setCurrentUser({
        ...currentUser,
        ...user,
      }));
    });
  }

  const getSprintSection = () => {
    if (currentSprint) {
      return (
        <div>
          <span>
            {currentSprint.name}
          </span>
          <Popup
            content={'Change Sprint'}
            key={`changesprinticon`}
            trigger={
              <Icon
                name={'exchange'}
                style={{ 
                  fontSize: '1.2em',
                  marginLeft: '10px',
                  cursor: 'pointer'
                }}
                onClick={() => onSprintChange(currentSprint.id)}
              />
            }
          />
        </div>
      );
    }

    return (
      <SprintSelector
        socket={socket}
      />
    )
  };

  const getUserProfile = () => {
    if (!currentUser) {
      return <></>;
    }

    return (
      <Image
        src={currentUser?.photoURL}
        circular={true}
        size={'tiny'}
        style={{
          width: '30px',
          display: 'inline-block'
        }}
      />
    )
  };

  const getCurrentTask = () => {
    if (currentUser?.currentTask) {
      return (
        <span
          onClick={() => dispatch(setCurrentUser({ ...currentUser, currentTask: null }))}
          style={{ marginLeft: '10px', marginTop: '5px' }}
        >
          on: {currentUser.currentTask.title}
        </span>
      );
    }
    
    return (
      <CurrentTaskDropdown
        name={'taskId'}
        placeholder={'Select current task'}
        onSelectTask={handleCurrentTask}
        socket={socket}
        selectedTask={currentUser?.currentTask}
      />
    )
  };

  const getRender = () => {
    if (!currentUser) {
      return <></>
    }

    return (
      <>
        <Menu.Item>
          {getUserProfile()}
          {getCurrentTask()}
        </Menu.Item>
        <Menu.Item>
          {getSprintSection()}
        </Menu.Item>
        <Menu.Item as={Link} to={'/sprint'}>
          <Icon
            style={{ fontSize: '1.2em'}}
            name='columns'
            size={'small'}
          />
          Boards
        </Menu.Item>
        <Menu.Item>
          <Button
            color={'green'}
            onClick={() => setAddSprint(!addSprint)}
          >
            Add Sprint
          </Button>
        </Menu.Item>
      </>
    )
  };

  const getAddSprint = () => {
    return(
      <AddSprint
        show={addSprint}
        onModalClose={() => setAddSprint(false)}
        onAddSprint={handleAddSprint}
      />
    );
  };

  return (
    <Sidebar
      as={Menu}
      animation='push'
      icon='labeled'
      inverted
      vertical
      visible={visible}
      width='thin'
      style={{
        backgroundColor: '#2f3136'
      }}
    >
      {getRender()}
      {getAddSprint()}
    </Sidebar>
  );
}

export default NavSidebar;