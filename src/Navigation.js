import React from 'react';
import { Link } from 'react-router-dom';
import './navigation.css';

const Navigation = (props) => (
  <div id = "myNav" className = "overlay">
    <a className = "closebtn"
        onClick = {() => props.closeNav()}>&times;</a>
    <div className = "overlay-content">
      <Link to = "/" onClick = {() => props.closeNav()}>Home</Link>
      <Link to = {`/dashboard/${props.userId}`} onClick = {() => props.closeNav()}>
        My Dashboard
      </Link>
      <Link to = "/" onClick = {() => {
        props.logout();
        props.closeNav();
      }}>Logout</Link>
    </div>
    </div>
  );

  export default Navigation;
