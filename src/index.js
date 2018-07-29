import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';//add in router
//import './index.css';
import Board from './Boards';
import registerServiceWorker from './registerServiceWorker';
import Login from './Login'; //add in login and register components
import Register from './Register';
import Home from './Home';
import Dashboard from './Dashboard';
import Lost from './Lost';

//need a nav component



// ReactDOM.render(<Board count={50}/>, document.getElementById('root'));
// registerServiceWorker();
//<Route exact path='/' component={Board} />

//not sure if need to wrap div around switch

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
