import React, {Component} from 'react'
import './noteDemo.css'
import Card from './Card'
import './card.css'
import './notes.css'
import FaPlus from 'react-icons/lib/fa/plus'
import FaFloppyO from 'react-icons/lib/fa/floppy-o'

class NoteDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {id:0,
        card: "little card one"},
        {id:1,
        card: "little card two"}

      ],
      editingTitle:false,

    }
    this.add = this.add.bind(this)
    this.eachCard = this.eachCard.bind(this)
    this.editTitle = this.editTitle.bind(this)
		this.saveTitle = this.saveTitle.bind(this)
		this.renderForm = this.renderForm.bind(this)
		this.renderDisplay = this.renderDisplay.bind(this)
    this.renderDisplay_back = this.renderDisplay_back.bind(this)

  }

  add(text) {
		var self = this;
		self.setState(prevState =>({
			cards:[
					...prevState.cards,
					{
						id:Math.floor(Math.random() *100),
						card:text
					}
			]
		}));
	}

  editTitle(){
    this.setState({
      cards:this.state.cards,
      editingTitle:true
    })
  }

  saveTitle(e){
    e.preventDefault()
    var noteSide = this.props.animation === " flipped"? "back" : "front";
    this.props.onChange(this[noteSide].value,this.props.index)
    this.setState({
      editingTitle: false
    })
  }

  // eachCard(card, i) {
  //   return (
  //     <Card key={card.id}
  //         index={card.id}
  //         mode = {this.props.mode}>
  //         {card.card}
  //       </Card>
  //   )
  // }
  eachCard(card, i) {
    return (
      <div key= {i}
      className = {`card_${this.props.mode}`}>
      <p>{card.card}</p>
      </div>
    )
  }

  // render() {
	// 	console.log("this state is" + this.props.animation );
	// 	return (
	// 		<div className = "demo-flip-container">
	// 		<div className = {`demo-note${this.props.animation}`}>
	// 			<div className = "demo-front" onDoubleClick = {() => this.props.onFlip(" flipped")}>
	// 				<p>{this.props.children}</p>
	// 				<button onClick={this.remove} id="remove">remove</button>
	// 				<button onClick={this.editTitle} id="edit">edit</button>
	// 			</div>
	// 			<div className = "demo-back" onDoubleClick = {() => this.props.onFlip("")}>
	// 				<p>{this.props.children}</p>
	// 			</div>
	// 		</div>
	// 		</div>
	// 	)
	// }
  renderForm(side) {
    return (
      <div>
        <form onSubmit={this.saveTitle}>
          <textarea ref={input => this[side] = input}
                defaultValue={this.props.children}/>
          <button id="save"><FaFloppyO /></button>
        </form>
      </div>
    )
  }
  renderDisplay() {
    console.log("rendering display");
    return (
      <div style = {{textAlign:'center'}}>
        <p onClick={this.editTitle}>{this.props.children}</p>
        {console.log(this.state.cards)}

        {this.state.cards.map(this.eachCard)}
        <span>
        <button onClick={this.add.bind(null,"New Card Demo")}
            id="add">
            <FaPlus />
        </button>
        </span>
      </div>
    )
  }
  renderDisplay_back() {
    return (
      <div>
      <p onClick={this.editTitle}>{this.props.children}</p>
      </div>
    )
  }


  render() {
    console.log("this state is" + this.props.animation );
    return (
      <div className = {`flip-container note_${this.props.mode}`}>
      <div className = {`note_${this.props.mode}`}>
      {
        this.state.editingTitle ? this.renderForm(this.props.animation === " flipped" ? "back" : "front") : (
        <div className = {`note note_${this.props.mode}${this.props.animation}`}>
        <div className = "front" onDoubleClick = {() => this.props.onFlip(" flipped")}>
                 {this.renderDisplay()}
        </div>
        <div className = "back-container back" onDoubleClick = {() => this.props.onFlip("")}>
                {this.renderDisplay_back()}
          </div>
          </div>
        )}
      </div>
      </div>
    )
  }

  }


export default NoteDemo
