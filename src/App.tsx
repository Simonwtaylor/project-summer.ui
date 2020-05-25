import React, { Component } from 'react';
import { HomePage, LoginPage, SprintPage } from './pages/index';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { Grid, Sidebar, Segment, Menu, Icon } from 'semantic-ui-react';
import { Navbar } from './components/navbar/';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setCurrentUser } from './redux/user/user.action';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { selectCurrentUser } from './redux/user/user.selector';
import { SprintDropdownContainer } from './components/dropdowns';
import socketIOClient from 'socket.io-client';

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
    this.handleSprintSelect = this.handleSprintSelect.bind(this);
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

  public setVisible(visible: boolean) {
    this.setState({
      ...this.state,
      visible,
    })
  }

  private handleMenuToggle() {
    this.setVisible(!this.state.visible);
  }

  private handleSprintSelect(sprint: any) {
    console.log('sprint', sprint);
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className={'app'}>
        <Navbar onMenuToggle={this.handleMenuToggle} />
        <Sidebar.Pushable as={Segment} style={{ margin: '0', background: 'none'}}>
          <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            inverted
            vertical
            visible={this.state.visible}
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
              <SprintDropdownContainer
                socket={this.socket}
                name={'sprint'}
                onSelectSprint={this.handleSprintSelect}
                selectedSprint={''}
              />
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Grid style={{ backgroundColor: '#36393f'}}>
              <Grid.Row>
                <Grid.Column>
                  <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/sprint" render={() => <SprintPage socket={this.socket} />}  />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
