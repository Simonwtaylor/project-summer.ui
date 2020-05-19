import React, { Component } from 'react';
import { HomePage } from './pages/index';
import { Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Navbar } from './components/navbar/';

class App extends Component<any, any> {
  // TODO: Refactor into components
  render() {
    return (
      <div className={'app'}>
        <Navbar />
        <Grid style={{ backgroundColor: '#36393f'}}>
          <Grid.Row>
            <Grid.Column>
              <Switch>
                <Route path={'/'} component={HomePage} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
