import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Board from './Boards';
import registerServiceWorker from './registerServiceWorker';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Dashboard from './Dashboard';
import Lost from './Lost';


ReactDOM.render(
  <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path = '/dashboard/:id' component = {Dashboard} />
        <Route exact path = '/board' component = {Board} />
        <Route component = {Lost} />
        </Switch>
  </Router>,
  document.getElementById('root')
);
//registerServiceWorker();
