import React, { Component} from 'react';
import NoteDemo from './NoteDemo.js'

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note : {
        animation: '',
        note: "ito pato milo mila taka tiki pouletlil ksne sjen djks dhfoe dheoslkhfdtujjosoa;ehrhf xijao;fwjohi oj tikCépa lajoi démitoka lana moulé macaréna Kika la po maka bomb"
      }
    }
    this.flipNote = this.flipNote.bind(this);
  }

  flipNote(side) {
    this.setState(prevState => ({
      note: {...prevState.note,animation: side}
    }));
  }
  render() {
    return (
      <div>
      <NoteDemo animation = {this.state.note.animation}
                onFlip = {this.flipNote}>
      {this.state.note.note}
      </NoteDemo>
      </div>
    )
  }

}

export default Demo;
