import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

class Create extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
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

    // axios.post('/api/auth/register', { username, password })
    //   .then((result) => {
    //     this.props.history.push("/login")
    //   });
      fetch(`/auth/register`, {
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
  		.then((response) => {
        this.props.history.push('/login');
      })
      .catch((error) => {
  		console.log(error);
    });
  }

  render() {
    const { username, password } = this.state;
    return (
      <div class="container">
        <form class="form-signin" onSubmit={this.onSubmit}>
          <h2 class="form-signin-heading">Register</h2>
          <label for="inputEmail" class="sr-only"></label>
          <input type="email" class="form-control" placeholder="Email address" name="username" value={username} onChange={this.onChange} required/>
          <label for="inputPassword" class="sr-only"></label>
          <input type="password" class="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required/>
          <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default Create;
