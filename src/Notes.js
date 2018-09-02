import React, { Component } from 'react'
import Card from './Card'
import FaPlus from 'react-icons/lib/fa/plus'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaTrash from 'react-icons/lib/fa/trash'
import FaFloppyO from 'react-icons/lib/fa/floppy-o'
import './notes.css'
import {Motion, spring} from 'react-motion';


const unanthMessage = "Unauthorized user,please login.";

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

class Note extends Component {
	constructor(props) {
		super(props)
		this.state = {
			topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
			itemsCount: null,
			cards: [],
			editingTitle:false,
      // isDragging: false,
      //usingPlaceHolder: false,
      //effect: ""
			//effect:" animated bounceInUp"
		}
    var usingPlaceHolder = false;
    var isUpdating = false;
    var isDragging = false;
    var needSaveOrder = false;
		this.add = this.add.bind(this)
		this.eachCard = this.eachCard.bind(this)
		this.update = this.update.bind(this)
		this.removeCard = this.removeCard.bind(this)
		this.remove = this.remove.bind(this)
		this.editTitle = this.editTitle.bind(this)
		this.saveTitle = this.saveTitle.bind(this)
		this.renderForm = this.renderForm.bind(this)
		this.renderDisplay = this.renderDisplay.bind(this)
    this.renderDisplay_back = this.renderDisplay_back.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.updateCardOrder = this.updateCardOrder.bind(this)
	}


	//load cards retrieved from server on each note
	componentWillMount() {
		this.setState({
			cards: this.props.cards.map(card => (
				{id: card._id,
				cardContent: card.cardContent}
			)),
			itemsCount : this.props.cards.length,
      effect : this.props.index == "placeHolder" ? " animated fadeIn" : ""
		});
	}
	componentDidMount() {
		window.addEventListener('touchmove', this.handleTouchMove);
		window.addEventListener('touchend', this.handleMouseUp);
		window.addEventListener('mousemove', this.handleMouseMove);
		window.addEventListener('mouseup', this.handleMouseUp);
	};
	//------------------------------------------------------------------------

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props !== nextProps|| this.state !== nextState
		)
	}
	//			this.props.children !== nextProps.children || this.state !== nextState || this.props.animation !== nextProps.animation


	editTitle(){
    if (this.props.index == "placeHolder") return;
		console.log('edit title')
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

	add(text) {
    if(this.usingPlaceHolder) return;
    //if(this.state.usingPlaceHolder) return;
    if(this.isDragging) return;
		var self = this;
    var ori = this.state.cards.length;
    fetch(`https://little-planet-1564-api.herokuapp.com/card/${this.props.index}`, {
		// fetch(`http://localhost:3000/card/${this.props.index}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`,
			},
			body: JSON.stringify({
				cardContent: text,
			})
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
			if(response.message === unanthMessage) {
				self.props.history.push("/login");
			} else {
        if(self.state.cards.length !== ori) {
				self.setState(prevState => ({
          //usingPlaceHolder : false,
					cards: prevState.cards.map(
						card => (card.id !== "placeHolderCard") ? card : {...card,id: response._id}
						)
				}));
        self.usingPlaceHolder = false;
				return;
			} else {
				self.setState(prevState =>({
          //usingPlaceHolder : false,
					cards:[
							...prevState.cards,
							{
								id:response._id,
								cardContent:text
							}
					]
				}));
        self.usingPlaceHolder = false;
        return;
      }
		}
		})
		.catch( (error) => {
		console.log(error);
	})
  self.usingPlaceHolder = true;
  self.setState(prevState =>({
    //usingPlaceHolder: true,
    cards:[
        ...prevState.cards,
        {
          id:"placeHolderCard",
          cardContent:text
        }
    ]
  }));
	}


	update(newText, i) {
    if(this.isDragging) return;
    if(this.isUpdating)return;
		var self = this;
    fetch(`https://little-planet-1564-api.herokuapp.com/card/${this.props.index}/${i}`, {
		// fetch(`http://localhost:3000/card/${this.props.index}/${i}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`,
			},
			body: JSON.stringify({
				cardContent: newText,
			})
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
			if(response.message === unanthMessage) {
				this.props.history.push("/login");
			}
		})
		.catch( (error) => {
		console.log(error);
	})
	self.setState(prevState => ({
		cards: prevState.cards.map(
			card => (card.id !== i) ? card : {...card,cardContent: newText}
			)
	}));
	}

  updateCardOrder(newCards, i) {
    if(this.isUpdating){
      console.log("preventing second update");
      return;
    }
    this.isUpdating = true;
    console.log("this note id is " + this.props.index);
    var self = this;
    fetch(`https://little-planet-1564-api.herokuapp.com/note/${this.props.index}`, {
		// fetch(`http://localhost:3000/note/${this.props.index}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`,
			},
			body: JSON.stringify({
				cards: newCards.map(card => ({cardContent: card.cardContent,
                                      _id: card.id})),
			})
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
      self.isDragging = false;
      self.isUpdating = false;
      console.log("inside card order is dragging is " + self.isDragging);
			if(response.message === unanthMessage) {
				self.props.history.push("/login");
			}
		})
		.catch( (error) => {
		console.log(error);
	})
  }

	remove() {
    if (this.props.index == "placeHolder") return;
		this.props.onRemove(this.props.index)
	}

	removeCard(id) {
    if(this.isDragging) return;
		console.log('removing item at', id)
		var self = this;
    fetch(`https://little-planet-1564-api.herokuapp.com/card/${this.props.index}/${id}`, {
		// fetch(`http://localhost:3000/card/${this.props.index}/${id}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
        'Authorization' : `${localStorage.getItem('jwtToken')}`,
			}
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
      if(response.message === unanthMessage) {
        this.props.history.push("/login");
      }
		})
		.catch( (error) => {
		console.log(error);
	})
	self.setState(prevState => ({
		cards: prevState.cards.filter(card => card.id !== id)
	}));
	}


	handleTouchStart = (key, pressLocation, e) => {
		this.handleMouseDown(key, pressLocation, e.touches[0]);
	};

	handleTouchMove = (e) => {
		e.preventDefault();
		this.handleMouseMove(e.touches[0]);
	};

	handleMouseDown = (pos, pressY, {pageY}) => {
    if(this.usingPlaceHolder) return;
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
      if(this.usingPlaceHolder) return;
      this.isDragging = true;
			console.log("pageY is " + pageY);
			console.log("topDeltaY " + topDeltaY);
			const mouseY = pageY - topDeltaY;
			console.log("mouseY is " + mouseY);
			const currentRow = clamp(clamp(Math.round(mouseY / 70), -itemsCount+1,itemsCount-1) +
                                      cards.indexOf(originalPosOfLastPressed),0,itemsCount-1);
			console.log("currentRow is " + currentRow);
			var newOrder = cards;
			if (currentRow !== cards.indexOf(originalPosOfLastPressed)){
				newOrder = reinsert(cards, cards.indexOf(originalPosOfLastPressed), currentRow);
        this.needSaveOrder = true;
        this.setState({topDeltaY: pageY, cards: newOrder});
			} else {
			  this.setState({mouseY: mouseY, cards: newOrder});
      }
		}
	};

	handleMouseUp = () => {
    this.setState({isPressed: false, topDeltaY: 0});
    if(this.needSaveOrder) {
      this.updateCardOrder(this.state.cards, this.props.index);
      this.needSaveOrder = false;
    } else{
      this.isDragging = false;
    }
  };

  handleDoubleClick() {
    if(this.isDragging) return;
    if(this.props.index == "placeHolder") return;
    this.props.onFlip(this.props.index, " flipped");
  }

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
        //                  usingPlaceHolder = {this.state.usingPlaceHolder}

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

							<Card key={card.id}
								  index={card.id}
									mode = {this.props.mode}
									onChange={this.update}
								  onRemove={this.removeCard}>
									{card.cardContent}
									</Card>
						</div>
					}
				</Motion>
		)
	}

	renderForm(side) {
		console.log('render Form')
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
		return (
			<div>
				<p onClick={this.editTitle}>{this.props.children}</p>
				<button onClick={this.remove} id="remove"><FaTrash /></button>
				<button onClick={this.editTitle} id="edit"><FaPencil /></button>
				<div className="demo8-outer">
				{this.state.cards.map(this.eachCard)}
				</div>
				<span>
				<button onClick={this.add.bind(null,"New Card")}
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
				<button onClick={this.remove} id="remove"><FaTrash /></button>
				<button onClick={this.editTitle} id="edit"><FaPencil /></button>
			</div>
		)
	}


	render() {
		return (
			<div className = {`flip-container note_${this.props.mode}${this.state.effect}`}>
			<div className = {`note_${this.props.mode}`}>
			{
				this.state.editingTitle ? this.renderForm(this.props.animation === " flipped" ? "back" : "front") : (
				<div className = {`note note_${this.props.mode}${this.props.animation}`}>
				<div className = "front" onDoubleClick = {() => this.handleDoubleClick()}>
								 {this.renderDisplay()}
				</div>
				<div className = "back-container back" onDoubleClick = {() => this.props.onFlip(this.props.index, "")}>
								{this.renderDisplay_back()}
					</div>
					</div>
				)}
			</div>
			</div>
		)
	}

}


export default Note;
