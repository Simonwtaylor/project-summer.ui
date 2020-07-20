import React, { Component } from 'react';
import { HomePage, LoginPage, SprintPage } from './pages/index';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Grid, Sidebar, Segment } from 'semantic-ui-react';
import { Navbar } from './components/navbar/';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setCurrentUser } from './redux/user/user.action';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { selectCurrentUser } from './redux/user/user.selector';
import socketIOClient from 'socket.io-client';
import NavSidebar from './components/sidebar/nav-sidebar.component';
import { setCurrentSprint } from './redux/sprint/sprint.action';

class App extends Component<any, any> {
  
  unsubscribeFromAuth: any = null;
  socket: SocketIOClient.Socket|undefined = undefined;

  constructor(props: any) {
    super(props);
    this.state = {
      visible: true,
    }

    this.setVisible = this.setVisible.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
    this.handleSprintChange = this.handleSprintChange.bind(this);
    this.getRouting = this.getRouting.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
  }

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = await createUserProfileDocument(user, {});

        if (userRef) {
          setCurrentUser({
            id: userRef.id, 
            ...userRef,
            ...user,
          });
          
          this.socket = socketIOClient(
            process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
            query: {
              token: await user.getIdToken(),
            }
          });

          this.socket?.emit('joinUserRoom', { id: userRef.id });
        }
      }
      
      setCurrentUser({
        ...this.props.currentUser,
        ...user,
      });
    });
  }

  public setVisible(visible: boolean) {
    this.setState({
      ...this.state,
      visible,
    })
  }

  private handleMenuToggle() {
    this.setVisible(!this.state.visible);
  }

  private handleSprintChange(prevSprintId: number) {
    this.props.setCurrentSprint(undefined);
    this.socket?.emit('exitSprintRoom', { id: prevSprintId });
  }

  private loggedIn() {
    const { currentUser } = this.props;
    if (
      !currentUser ||
      (currentUser && Object.keys(currentUser).length === 0)
    ) {
      return false;
    }

    return true;
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  private getRouting() {
    if (!this.loggedIn()) {
      return (
        <>
          <Route path="/login" component={LoginPage} />
          <Redirect from="/" exact to="/login" />
        </>
      );
    }
    
    return (
      <>
        <Route path="/sprint/:id" render={() => <SprintPage socket={this.socket} />}  />
        <Route path="/sprint" exact render={() => <SprintPage socket={this.socket} />}  />
        <Route path={'/home'} render={() => <HomePage socket={this.socket} />} />
        <Redirect from="/" exact to="/sprint" />
      </>
    );
  }

  render() {
    return (
      <div className={'app'}>
        <Navbar onMenuToggle={this.handleMenuToggle} />
        <Sidebar.Pushable as={Segment} style={{ margin: '0', background: 'none'}}>
          <NavSidebar
            visible={this.state.visible && this.loggedIn()}
            socket={this.socket}
            onSprintChange={this.handleSprintChange}
          />
          <Sidebar.Pusher>
            <Grid style={{ backgroundColor: '#36393f'}}>
              <Grid.Row>
                <Grid.Column>
                  <Switch>
                    {this.getRouting()}
                  </Switch>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}


const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch: any) => ({
  setCurrentUser: (user: any) => dispatch(setCurrentUser(user)),
  setCurrentSprint: (sprint: any) => dispatch(setCurrentSprint(sprint))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
