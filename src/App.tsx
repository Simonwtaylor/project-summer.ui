import React, { Component } from 'react';
import { HomePage, LoginPage, SprintPage } from './pages/index';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Grid, Sidebar, Segment } from 'semantic-ui-react';
import { Navbar, NavSidebar } from './components/';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setCurrentUser, selectCurrentUser, setCurrentSprint } from './redux/index';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import socketIOClient from 'socket.io-client';
import { ROUTER_ENUMS } from './lib/enums';

class App extends Component<any, any> {
  
  unsubscribeFromAuth: any = null;
  socket: SocketIOClient.Socket|undefined = undefined;

  constructor(props: any) {
    super(props);
    this.state = {
      visible: true,
      sprintState: ROUTER_ENUMS.SPRINT,
    };

    this.setVisible = this.setVisible.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
    this.handleSprintChange = this.handleSprintChange.bind(this);
    this.getRouting = this.getRouting.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.handleSprintSectionChange = this.handleSprintSectionChange.bind(this);
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
          setCurrentUser({
            id: userRef.id, 
            ...userRef,
            ...user,
            roomJoined: true,
          });

          this.socket?.on('user', (user: any) => {
            setCurrentUser({
              ...userRef,
              ...user,
              id: userRef.id,
            });
          });
        }
      }

      // setCurrentUser({
      //   ...this.props.currentUser,
      //   ...user,
      // });
    });
  }

  public setVisible(visible: boolean) {
    this.setState({
      ...this.state,
      visible,
    });
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

  private handleSprintSectionChange(sprintState: ROUTER_ENUMS) {
    this.setState({
      ...this.state,
      sprintState,
    });
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

    const { sprintState } = this.state;

    return (
      <>
        <Route path="/sprint/:id" render={() => <SprintPage sprintState={sprintState} socket={this.socket} />}  />
        <Route path="/sprint" exact render={() => <SprintPage sprintState={sprintState} socket={this.socket} />}  />
        <Route path={'/home'} render={() => <HomePage socket={this.socket} />} />
        <Redirect from="/" exact to="/home" />
      </>
    );
  }

  render() {

    const { visible } = this.state;

    return (
      <div className={'app'}>
        <Sidebar.Pushable as={Segment} style={{ margin: '0', background: 'none'}}>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column
                style={{
                  display: (visible) ? 'inline-block' : 'none',
                }}
                width={2}
              >
                <NavSidebar
                  visible={visible && this.loggedIn()}
                  socket={this.socket}
                  onSprintChange={this.handleSprintChange}
                  onSprintSectionChange={this.handleSprintSectionChange}
                />
              </Grid.Column>
              <Grid.Column
                width={visible ? 14 : 16}
              >
                <Grid>
                  <Grid.Row columns={1}>
                    <Grid.Column>
                      <Navbar
                        onMenuToggle={this.handleMenuToggle}
                        socket={this.socket}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Column>
                      <Sidebar.Pusher
                        style={{
                          backgroundColor: '#36393f',
                        }}
                      >
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
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
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
