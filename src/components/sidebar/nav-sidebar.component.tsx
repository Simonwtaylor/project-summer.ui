import * as React from 'react';
import { Sidebar, Menu, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { SprintSelector } from '../sprint/index';
import { useSelector } from 'react-redux';
import { selectCurrentSprint } from '../../redux/sprint/sprint.selector';

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
                onClick={() => onSprintChange(+currentSprint.id)}
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
    </Sidebar>
  );
}

export default NavSidebar;