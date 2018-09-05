import React, {Component} from 'react'
import ReactMarkdown from 'react-markdown'
import './noteDemo.css'
import Card from './Card'
import './card.css'
import './notes.css'
import FaPlus from 'react-icons/lib/fa/plus'
import FaFloppyO from 'react-icons/lib/fa/floppy-o'
import {Motion, spring} from 'react-motion';

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = {stiffness: 300, damping: 50};
const itemsCount = 10;

class NoteDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
			itemsCount: 2,
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

  componentDidMount() {
  		window.addEventListener('touchmove', this.handleTouchMove);
  		window.addEventListener('touchend', this.handleMouseUp);
  		window.addEventListener('mousemove', this.handleMouseMove);
  		window.addEventListener('mouseup', this.handleMouseUp);
  	};

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
  handleTouchStart = (key, pressLocation, e) => {
		this.handleMouseDown(key, pressLocation, e.touches[0]);
	};

	handleTouchMove = (e) => {
		e.preventDefault();
		this.handleMouseMove(e.touches[0]);
	};

	handleMouseDown = (pos, pressY, {pageY}) => {
		this.setState({
			topDeltaY: pageY - pressY,
			mouseY: pressY,
			isPressed: true,
			originalPosOfLastPressed: pos,
		});
	};

  handleMouseMove = ({pageY}) => {
		const {isPressed, topDeltaY, cards, originalPosOfLastPressed, itemsCount} = this.state;
		if (isPressed) {
			const mouseY = pageY - topDeltaY;
			const currentRow = clamp(clamp(Math.round(mouseY / 70), -itemsCount+1,itemsCount-1) +
                                      cards.indexOf(originalPosOfLastPressed),0,itemsCount-1);
			var newOrder = cards;
			if (currentRow !== cards.indexOf(originalPosOfLastPressed)){
				newOrder = reinsert(cards, cards.indexOf(originalPosOfLastPressed), currentRow);
        this.setState({topDeltaY: pageY, cards: newOrder});
			} else {
			  this.setState({mouseY: mouseY, cards: newOrder});
      }
		}
	};

	handleMouseUp = () => {
    this.setState({isPressed: false, topDeltaY: 0});
  };

  eachCard(card, i) {
		const {mouseY, isPressed, originalPosOfLastPressed, cards} = this.state;
		const style = originalPosOfLastPressed === card && isPressed
			? {
					scale: spring(1.1, springConfig),
					shadow: spring(16, springConfig),
					y: mouseY,
				}
			: {
					scale: spring(1, springConfig),
					shadow: spring(1, springConfig),
					y: spring(cards.indexOf(card) * 2, springConfig),
				};
		return (
				<Motion style={style} key={i}>
					{({scale, shadow, y}) =>
						<div
							onMouseDown={this.handleMouseDown.bind(null, card, y)}
							onTouchStart={this.handleTouchStart.bind(null, card, y)}
							className="demo8-item"
							style={{
								transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
								WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
								zIndex: card === originalPosOfLastPressed ? 0 : cards.indexOf(card),
							}}>

              <div key= {i}
              className = {`card_${this.props.mode}`}>
              <p><ReactMarkdown source = {card.card} /></p>
              </div>

						</div>
					}
				</Motion>
		)
	}

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
        <p onClick={this.editTitle}>
        <ReactMarkdown source = {this.props.children} />
        </p>
        <div className="demo8-outer">
        {this.state.cards.map(this.eachCard)}
        </div>
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
      <p onClick={this.editTitle}>
      <ReactMarkdown source = {this.props.children} />
      </p>
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
