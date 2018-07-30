import React, { Component} from 'react';
import NoteDemo from './NoteDemo.js'

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note : {
        animation: '',
        note: this.props.text,
      }
    }
    this.flipNote = this.flipNote.bind(this);
    this.updateTitle = this.updateTitle.bind(this)

  }

  updateTitle(newNoteTitle, i) {
    var self = this;
  self.setState(prevState => ({
    note: {...prevState.note,note: newNoteTitle}
  }));
  }
  flipNote(side) {
    this.setState(prevState => ({
      note: {...prevState.note,animation: side}
    }));
  }
  render() {
    return (
      <div>
      <NoteDemo
      mode = {this.props.mode}
      animation = {this.state.note.animation}
      onChange={this.updateTitle}
      onFlip = {this.flipNote}
      style = {{textAlign:'center'}}>

      {this.state.note.note}
      </NoteDemo>
      </div>
    )
  }

}

export default Demo;
