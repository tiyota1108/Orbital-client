import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import Demo from './Demo';

//style={{ textDecoration: 'none' }}
const Home = (props) => {
  return(
  <div className = 'container_home'>

  <div class="title">
  <p className="group-name animated bounceInDown">1564</p>
  <pre className="title-quote animated fadeIn"> 'I wonder,' he said, 'whether the stars are set alight {"\n"} in heaven so that one day each one of us may find his own again...'</pre>
  </div>
  <div className = "container_intro">
    <Link to = "/login"  className = "link">
     Login or register to start creating! </Link>
     <pre className = "intro-text">a personal space for your thoughts, plans, and ideas
     </pre>
  </div>


<div className = "modeBlock">
<div className = "modes">

<div className = "mode-wrapper">

  <div className="mode2">
  <p className = "right-side"> break it down by adding cards</p>

    <Demo className = "showNote" text = "Daylight Mode" mode = "daylight"></Demo>
  </div>
  <div className = "quote-wrapper">
    <p className = "diary-quote">"The grain, which is also golden, will bring me back the thought of you. And I shall love to listen to the wind in the wheat."</p>
  </div>
</div>

  <div className = "mode-wrapper">
    <div className="mode1">
      <p className = "right-side"> click on the text to edit</p>
      <Demo text = "Diary Mode" mode = "diary"></Demo>
    </div>
    <div className = "quote-wrapper">
      <p className = "diary-quote">"What makes the desert beautiful',said the little prince, 'is that somewhere it hides a well..."</p>
    </div>
  </div>


  <div className = "mode-wrapper">
    <div className="mode3">
      <p className = "right-side"> double-click to flip it around</p>
      <Demo text = "Night Mode" mode = "night"></Demo>
    </div>
    <div className = "quote-wrapper">
      <p className = "diary-quote">"If you love a flower that lives on a star, it is sweet to look at the sky at night. All the stars are a-bloom with flowers..."</p>
    </div>
  </div>
</div>
</div>

  <div className="mode4">
  <pre>inspired by Le Petit Prince{"\n"}made with love by a little prince & not her fox</pre>
  </div>
  </div>);
  }

export default Home;
