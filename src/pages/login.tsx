import * as React from 'react';
import { SignIn } from '../components/';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/index';

export interface ILoginPageProps extends RouteComponentProps<any> {

}

const LoginPage: React.FC<ILoginPageProps> = ({
  history,
}) => {
  const currentUser = useSelector(selectCurrentUser);

  if (currentUser && Object.keys(currentUser).length !== 0) {
    history.push('/sprint');
  }

  return (
    <div
      style={{
        padding: '20px',
      }}
      className='login'
    >
      <SignIn />
    </div>
  );
};

export default withRouter(LoginPage);
