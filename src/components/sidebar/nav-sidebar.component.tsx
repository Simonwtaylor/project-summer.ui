import * as React from 'react';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { SprintSelector } from '../sprint/index';

export interface INavSidebarProps {
  socket?: SocketIOClient.Socket;
  visible: boolean;
}
 
const NavSidebar: React.FC<INavSidebarProps> = ({
  socket,
  visible,
}) => {
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
      <Menu.Item as={Link} to={'/sprint'}>
        <Icon
          style={{ fontSize: '1.2em'}}
          name='columns'
          size={'small'}
        />
        Sprint
      </Menu.Item>
      <Menu.Item>
        <SprintSelector
          socket={socket}
        />
      </Menu.Item>
    </Sidebar>
  );
}

export default NavSidebar;