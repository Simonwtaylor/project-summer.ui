import * as React from 'react';
import { Sidebar, Menu, Icon, Popup, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { SprintSelector } from '../sprint/index';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentSprint, selectCurrentUser } from '../../redux/index';
import AddSprint from '../sprint/add-sprint.component';
import { ROUTER_ENUMS } from '../../lib/enums';

const { SPRINT, SPRINT_ACTIVITY, SPRINT_CHAT } = ROUTER_ENUMS;

export interface INavSidebarProps {
  socket?: SocketIOClient.Socket;
  visible: boolean;
  onSprintChange: (prevSprintId: number) => void;
  onSprintSectionChange: (sprintSection: ROUTER_ENUMS) => void;
}
 
const NavSidebar: React.FC<INavSidebarProps> = ({
  socket,
  visible,
  onSprintChange,
  onSprintSectionChange,
}) => {

  const currentSprint = useSelector(selectCurrentSprint);
  const currentUser = useSelector(selectCurrentUser);

  const [addSprint, setAddSprint] = React.useState(false);

  const handleAddSprint = (sprint: any) => {
    socket?.emit('addSprint', { 
      ...sprint,
    });
  };

  const getSprintSection = () => {
    if (currentSprint) {
      return (
        <></>
      );
    }

    return (
      <Menu.Item>
        <SprintSelector
          socket={socket}
        />
      </Menu.Item>
    )
  };

  const getSprintHeader = () => {
    if (currentSprint) {
      return (
        <div>
          <span>
            <b>{currentSprint.name}</b>
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

    return 'Sprint';
  };

  const getSprintOptions = () => {
    if (!currentSprint) {
      return <></>;
    }

    return (
      <>
        <Menu.Item
          as={Link}
          to={'/sprint'}
          onClick={() => onSprintSectionChange(SPRINT)}
          style={{
            fontSize: '12px',
          }}
        >
          <Icon
            style={{ fontSize: '1.2em'}}
            name='columns'
            size={'small'}
          />
          Boards
        </Menu.Item>
        <Menu.Item
          as={Link}
          to={'/sprint'}
          onClick={() => onSprintSectionChange(SPRINT_ACTIVITY)}
          style={{
            fontSize: '12px',
          }}
        >
          <Icon
            style={{ fontSize: '1.2em'}}
            name='history'
            size={'small'}
          />
          Activity
        </Menu.Item>
        <Menu.Item
          as={Link}
          to={'/sprint'}
          onClick={() => onSprintSectionChange(SPRINT_CHAT)}
          style={{
            fontSize: '12px',
          }}
        >
          <Icon
            style={{ fontSize: '1.2em'}}
            name='chat'
            size={'small'}
          />
          Chat
        </Menu.Item>
      </>
    );
  };

  const getRender = () => {
    if (!currentUser) {
      return <></>
    }

    return (
      <>
        <Menu.Header
          style={{
            color: 'white',
            borderBottom: '1px solid rgba(255,255,255, 0.1',
            borderTop: '1px solid rgba(255,255,255, 0.1',
            paddingBottom: '5px',
            paddingTop: '5px',
          }}
        >
          {getSprintHeader()}
        </Menu.Header>
          {getSprintSection()}
          {getSprintOptions()}
        <Menu.Item>
          <Button
            color={'green'}
            size={'tiny'}
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
        width: 'inherit',
        backgroundColor: '#2f3136'
      }}
    >
      {getRender()}
      {getAddSprint()}
    </Sidebar>
  );
}

export default NavSidebar;