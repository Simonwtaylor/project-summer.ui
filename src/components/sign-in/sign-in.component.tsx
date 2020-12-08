import * as React from 'react';
import { auth } from '../../firebase/firebase.utils';
import { Icon, Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { googleSignInStart } from '../../redux/index';

export interface ISignInProps {
  
}

const SignIn: React.FC<ISignInProps> = () => {
  const dispatch = useDispatch();

  const getUserInfo = () => {
    if(auth?.currentUser?.photoURL) {
      return (
        <img
          width={30}
          height={30}
          src={auth.currentUser.photoURL}
          alt="profile sign in"
        />
      );
    }
    return <></>;
  };

  return (
    <div className="sign-in">
      <h2>
        Please sign in with one of the following providers:
      </h2>
      {getUserInfo()}
      <Button
        inverted
        type="button"
        color="blue"
        onClick={() => dispatch(googleSignInStart())}
      >
        <Icon name="google" />
        Sign in with Google
      </Button>
    </div>
  );
};

export default SignIn;
