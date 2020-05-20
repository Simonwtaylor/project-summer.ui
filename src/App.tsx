import React, { Component } from 'react';
import { HomePage, LoginPage } from './pages/index';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Navbar } from './components/navbar/';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setCurrentUser } from './redux/user/user.action';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { selectCurrentUser } from './redux/user/user.selector';
import socketIOClient from 'socket.io-client';

class App extends Component<any, any> {
  
  unsubscribeFromAuth: any = null;
  socket: SocketIOClient.Socket|undefined = undefined;

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = await createUserProfileDocument(user, {});

        if (userRef) {
          setCurrentUser({
            id: userRef.id, 
            ...userRef,
          });
          
          this.socket = socketIOClient(
            process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
            query: {
              token: await user.getIdToken(),
            }
          });
        }
      }
      setCurrentUser(user);
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className={'app'}>
        <Navbar />
        <Grid style={{ backgroundColor: '#36393f'}}>
          <Grid.Row>
            <Grid.Column>
              <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path={'/home'} render={() => <HomePage socket={this.socket} />} />
                {
                  (!this.props.currentUser)
                  ?
                    <Redirect from="/" exact to="/login" />
                  : <Redirect from="/" exact to="/home" />
                }
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}


const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch: any) => ({
  setCurrentUser: (user: any) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
