import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import './lost.css';

const Lost = () => {
  return (
    <div className = "lostMessage animated fadeIn">

      <pre>
              Pito pato milo mila taka tiki poulet tika {"\n"}
              Cépa lajoi démitoka lana moulé macaréna{"\n"}
        Pao lettus pabo pati mélé cépa maka gusta{"\n"}
        Mami lébel méla moustache ella pika {"\n"}
        muchaaa{"\n"}
        {"\n"}
        Moka coca pila caca fissa bella lamassala{"\n"}
        Papa mama loca pita pola gusta la rumbada{"\n"}
        Chaipa koda mila toka bocca pis-sa la{"\n"}
        lasagnaaa{"\n"}
        {"\n"}

        Kika la po maka bomba bella mira la bologna{"\n"}
        Kika la po maka bomba bella mira la bologna{"\n"}
        </pre>
        <h1
        style = {{color: '#9d6a89'}}>
          You are lost!
        </h1>
        <h2 className = "animated rubberBand"
        style = {{color: '#9d6a89'}}>
        click <Link to='/' style = {{color: '#725d68'}}>here</Link> to go back home
        </h2>
        <pre>
        Kika la po maka bomba bella mira la bologna{"\n"}
        Kika la po maka bomba bella mira la bolognaaaaa{"\n"}
        {"\n"}

        Pito pato milo mila taka tiki poulet tika{"\n"}
        Cépa lajoi démitoka lana moulé macaréna{"\n"}
        Moka coca pila caca fissa bella lamassala{"\n"}
        Papa mama loca pita pola gusta la rumbadaaa{"\n"}
        Moka coca pila caca fissa bella lamassala{"\n"}
        Papa mama loca pita pola gusta la rumbadaaa{"\n"}
        {"\n"}

        Chaipa koda mila toka bocca pis-sa la lasagna{"\n"}
        Chaipa koda mila toka bocca pis-sa la lasagna{"\n"}
        Chaipa koda mila toka bocca pis-sa la{"\n"}
        lasagnaaa{"\n"}
        {"\n"}

        Moka coca pila caca fissa bella lamassala{"\n"}
        Papa mama loca pita pola gusta la{"\n"}
        rumbadaaa{"\n"}
        {"\n"}

              </pre>
    </div>
  )
}

export default Lost;
