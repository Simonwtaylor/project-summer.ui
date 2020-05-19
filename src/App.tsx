import React, { Component } from 'react';
import { HomePage } from './pages/index';
import { Switch, Route } from 'react-router-dom';

class App extends Component<any, any> {
  // TODO: Refactor into components
  render() {
    return (
    <Switch>
      <Route path={'/'} component={HomePage} />
    </Switch>
    );
  }
}

export default App;
