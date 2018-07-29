import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

class Login extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { username, password } = this.state;
    fetch(`/auth/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,//i just use the username to fake the unique email first
        password: password
      })
    })
    // .then(response => {
    //   if(response.status === 401) {
    //     this.setState({ message: 'Login failed. Username or password not match' });
    //   }
    // })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      if(response.message !== undefined) {
            this.setState({ message: 'Login failed. Username or password not match' });
      } else {
      localStorage.setItem('jwtToken', 'JWT ' + response.token);
      this.setState({ message: 'Welcome!'});
      this.props.history.push(`/dashboard/${response.id}`);//get userId from response and pass to url
    }
    })
    .catch((error) => {
        console.log(error);
        // if(error.response.status === 401) {
        //     this.setState({ message: 'Login failed. Username or password not match' });
        //   }
      });
  }

  render() {
    const { username, password, message } = this.state;
    return (
      <div className="container">
        <form className="form-signin" onSubmit={this.onSubmit}>
          {message !== '' &&
            <div className="alert alert-warning alert-dismissible" role="alert">
              { message }
            </div>
          }
          <h2 className="form-signin-heading">SIGN IN</h2>
          
          <label htmlFor="inputEmail" className="sr-only"></label>
          <input type="email" className="form-control" placeholder="Email address" name="username" value={username} onChange={this.onChange} required/>
          <label htmlFor="inputPassword" className="sr-only"></label>
          <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required/>
          
          <button className="btn" type="submit">Login</button>
        </form>
        <p class="hint">
          Not A Member? <Link to="/register"> Register Here</Link>
      </p>
      <p class="hint2">
          Or Go Back <Link to="/">Home</Link>
      </p>
    
      </div>
      
    );
  }
}

export default Login;
