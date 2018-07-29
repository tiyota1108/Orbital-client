import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = (props) => {
  return(
  <div>
  <div id = "login">
    <Link to = "/login"> Login/Register </Link>
  </div>
  <div className="title">
  <p className="group-name">#1564</p>
  <p className="title-quote"> 'I wonder,' he said,'whether the stars are set alight in heaven so that one day each one of us may find his own again...'</p>
  </div>
  <div className="mode1">
  <p className="instruction1">Mode1</p>
  <p>"'What makes the desert beautiful',said the little prince, 'is that somewhere it hides a well...'"</p>
  </div>
  <div className="mode2">
  <p className="instruction2">Mode2</p>
  <p>"If you love a flower that lives on a star, it is sweet to look at the sky at night. All the stars are a-bloom with flowers..."</p>
  </div>
  <div className="mode3">
  <p className="instruction3">Mode3</p>
  <p>"The grain, which is also golden, will bring me back the thought of you. And I shall love to listen to the wind in the wheat."</p>
  </div>
  <div className="mode4">
  <p className="instruction4">Mode4</p>
  <p>Flip the card</p>
  </div>
  </div>);
  }
  
export default Home;
