import * as React from 'react';
import { SignIn } from '../components/sign-in/';
 
const LoginPage: React.FC = () => { 
  return (
    <div className='login'>
      <SignIn />
    </div>
  );
}

export default LoginPage;