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
      message: '',
      loading:false
    };
  }
  toggle(){
    this.setState({loading:true})
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({loading:true})
    const { username, password } = this.state;
    if (this.state.username == ""){
      this.setState({loading:false})
    }
    fetch("https://little-planet-1564-api.herokuapp.com/auth/login", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        password: password
      })
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response);
      this.setState({loading:false});
      if(response.message !== undefined) {

            this.setState({ message: 'Login failed. Username or password not match',
            loading:false });
      } else {
      localStorage.setItem('jwtToken', 'JWT ' + response.token);
      this.setState({ message: 'Welcome!'});
      this.props.history.push(`/dashboard/${response.id}`);
    }
    })
    .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let btnClass = ["btn"];
    if(this.state.loading){
      btnClass.push('loader');
    }
    const { username, password, message } = this.state;
    return (
      <div className="container_login">
        <form className="form-signin" onSubmit={this.onSubmit}>
          {message !== '' &&
            <div className="alert" role="alert">
              { message }
            </div>
          }
          <h2 className="form-signin-heading">SIGN IN</h2>

          <label htmlFor="inputEmail" className="sr-only"></label>
          <input type="email" className="form-control" placeholder="Email address" name="username" value={username} onChange={this.onChange} required/>
          <label htmlFor="inputPassword" className="sr-only"></label>
          <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required/>
          {this.state.loading ?
          (<button className="anim">
          <div class="loader">
            <div class="circle"></div>
           </div></button>):
          <button className="btn"  type="submit">Login</button>}
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
