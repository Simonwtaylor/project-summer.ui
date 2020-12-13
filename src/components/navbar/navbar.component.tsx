import * as React from 'react';
import { Menu, Icon, Image } from 'semantic-ui-react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/index';

export interface NavbarProps extends RouteComponentProps<any> {
  onMenuToggle: () => void;
  socket?: SocketIOClient.Socket;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
  history,
}) => {
  const currentUser = useSelector(selectCurrentUser);

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
          onClick={() => history.push('/home')}
        />
      </>
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
        {getUserProfile()}
      </Menu.Item>
    </Menu>
  );
};

export default withRouter(Navbar);
