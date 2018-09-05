import React, {Component} from 'react'
import Card from './Card'
import './card.css'
import './notes.css'


class NoteSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh : this.props.refresh,
    }
    this.eachCard = this.eachCard.bind(this);
    this.renderDisplay = this.renderDisplay.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props!== nextProps|| this.state !== nextState
    )
  }

  eachCard(card, i) {
    return (
      <div key= {i}
      className = {`card card_${this.props.mode}`}>
      <p dangerouslySetInnerHTML={{__html: card.cardContent}}></p>
      </div>
    )
  }


  renderDisplay() {
    var cardsToMap = this.props.cards || [];
    return (
      <div>
      <p dangerouslySetInnerHTML={{__html: this.props.children}}></p>
          {cardsToMap.map(this.eachCard)}
      </div>
    )
  }

  render() {
    return (
      <div className = {`flip-container note_${this.props.mode}`}>
      <div className = {`note note_${this.props.mode}`}>
                 {this.renderDisplay()}
      </div>
      </div>
    )
  }

  }


export default NoteSearch
