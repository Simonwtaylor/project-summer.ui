import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export interface NavbarProps {
  onMenuToggle: () => void;
}
 
const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
}) => {

  return (
    <Menu stackable className={'navbar'} style={{ backgroundColor: '#2f3136', borderRadius: '0px', marginBottom: '0' }}>
      <Menu.Item
        as={ Link }
        to='#'
        name=''
        onClick={() => onMenuToggle()}
      >
        <Icon name={'bars'} style={{ color: 'white'}} />
      </Menu.Item>
    </Menu>
  );
}
 
export default Navbar;