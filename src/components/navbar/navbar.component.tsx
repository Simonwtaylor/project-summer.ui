import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export interface NavbarProps {
  
}
 
const Navbar: React.FC<NavbarProps> = () => {
  const onItemClick = (name: string) => {
    console.log(name);
  };

  return (
    <Menu stackable className={'navbar'} style={{ backgroundColor: '#2f3136', borderRadius: '0px' }}>
      <Menu.Item
        as={ Link }
        to='/'
        name='home'
        onClick={() => onItemClick('hme')}
      >
        <Icon name={'columns'} style={{ color: 'white'}} />
      </Menu.Item>
    </Menu>
  );
}
 
export default Navbar;