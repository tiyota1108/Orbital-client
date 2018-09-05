import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import Note from './Notes'
import FaPlus from 'react-icons/lib/fa/plus'
import FaTrash from 'react-icons/lib/fa/trash'
import More from 'react-icons/lib/io/android-more-horizontal'
import SearchIcon from 'react-icons/lib/io/ios-search-strong'
import Card from './Card'
import Loading from './Loading'
import Navigation from './Navigation'
import Search from './Search.js'
import './boards.css'

const unanthMessage = "Unauthorized user,please login.";
class Board extends Component {
	constructor(props) {
		super(props)
		this.state = {
			refresh: false,
			loading: true,
			notes: []
		}
		var usingPlaceHolder = false;
		var comingInEffect = " bounceInUp";
		var boardId;
		this.add = this.add.bind(this)
		this.eachNote = this.eachNote.bind(this)
		this.updateTitle = this.updateTitle.bind(this)
		this.remove = this.remove.bind(this)
		this.logout = this.logout.bind(this)
		this.openNav = this.openNav.bind(this)
		this.closeNav = this.closeNav.bind(this)
		this.flipNote = this.flipNote.bind(this)
		this.openSearch = this.openSearch.bind(this)
		this.closeSearch = this.closeSearch.bind(this)
	}

	componentWillMount() {
		var self = this;
		if(this.props.location.state !== undefined){
			this.boardId = this.props.location.state.boardId;
		} else {
			this.props.history.push("/login");
			return;
		}
		setTimeout(() => this.setState({loading: false}), 1000);
		fetch(`https://little-planet-1564-api.herokuapp.com/note/${this.boardId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`
			}
		})
				.then(response => response.json())
				.then(response => {
					//console.log(response);
					if(response.message === unanthMessage) {
						this.props.history.push("/login");
					} else {
					self.setState({
						boardTitle : response.boardTitle,
						mode: response.mode,
						notes: response.notes.map(note => (
							{
								animation: note.animation,
								id: note._id,
							note: note.noteTitle,
						cards: note.cards}
						))
					})
				}
				})
				.catch( (error) => {
				console.log(error);
			})

		}
		//-----------------------------------------------------------------------

	add(note) {
		if(this.usingPlaceHolder) return;
		var self = this;
		var ori = this.state.notes.length;
		fetch(`https://little-planet-1564-api.herokuapp.com/note/${this.boardId}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`
			},
			body: JSON.stringify({
				noteTitle: note,
			})
		})
		.then(response => response.json())
		.then(response => {
			//console.log(response);
			if(response.message === unanthMessage) {
				this.props.history.push("/login");
			} else {
				if(self.state.notes.length !== ori) {
				self.setState(prevState => ({
					notes: prevState.notes.map(
						note => (note.id !== "placeHolder") ? note : {...note,id: response._id}
						)
				}));
				this.comingInEffect = " animated bounceInUp";
				this.usingPlaceHolder = false;
				return;
			} else {
			self.setState(prevState =>({
				notes:[
				    ...prevState.notes,
				    {
							animation: "",
							id:response._id,
				    	note: note,
							cards:[],
				    }
				]
			}));
			this.comingInEffect = " animated bounceInUp";
			this.usingPlaceHolder = false;
			return;
		}
	}
		})
		.catch( (error) => {
			if(error.response)
		console.log(error);
	})
	this.usingPlaceHolder = true;
	self.setState(prevState =>({
		notes:[
				...prevState.notes,
				{
					animation: "",
					id:"placeHolder",
					note: note,
					cards:[],
				}
		]
	}));
	this.comingInEffect = "";
	}

	updateTitle(newNoteTitle, i) {
		var self = this;
		fetch(`https://little-planet-1564-api.herokuapp.com/note/${i}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`
			},
			body: JSON.stringify({
				noteTitle: newNoteTitle,
			})
		})
		.then(response => response.json())
		.then(response => {
			//console.log(response);
			if(response.message === unanthMessage) {
				this.props.history.push("/login");
			}
		})
		.catch((error) => {
		console.log(error);
		if(error.response.status === 401) {//try to access without authen
			this.props.history.push("/login");//can directly use history?
		}
	});
	self.setState(prevState => ({
		notes: prevState.notes.map(
			note => (note.id !== i) ? note : {...note,note: newNoteTitle}
			)
	}));
	}
	//------------------------------------------------------------------------

	remove(id) {
		var self = this;
		fetch(`https://little-planet-1564-api.herokuapp.com/note/${id}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`
			}
		})
		.then(response => response.json())
		.then(response => {
			//console.log(response);
			if(response.message === unanthMessage) {
				this.props.history.push("/login");
			}
		})
		.catch( (error) => {
		console.log(error);
	})
	self.setState(prevState => ({
		notes: prevState.notes.filter(note => note.id !== id)
	}));
	}

	openSearch() {
		this.setState({refresh: true});
		document.getElementById("mySearch").style.width = "100%";
	}

	closeSearch() {
		this.setState({refresh: false});
		document.getElementById("mySearch").style.width = "0%";
	}


	openNav() {
		document.getElementById("myNav").style.width = "100%";
	}

	closeNav() {
		document.getElementById("myNav").style.width = "0%";
	}

	logout = () => {
    localStorage.removeItem('jwtToken');
		window.location.replace('/');
  }

	flipNote(noteId, side) {
		var self = this;
		fetch(`https://little-planet-1564-api.herokuapp.com/note/${noteId}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`
			},
			body: JSON.stringify({
				animation: side,
			})
		})
		.then(response => response.json())
		.then(response => {
			//console.log(response);
			if(response.message === unanthMessage) {
				this.props.history.push("/login");
			}
		})
		.catch((error) => {
		console.log(error);
		if(error.response.status === 401) {
			this.props.history.push("/login");
		}
	});
	self.setState(prevState => ({
		notes: prevState.notes.map(
			note => (note.id !== noteId) ? note : {...note,animation: side}
			)
	}));
	}

	eachNote(note, i) {
		return (
			<Note key={note.id}
				  index={note.id}
					duration = {150}
					mode = {this.state.mode}
					animation = {note.animation}
					cards = {note.cards}
				  onChange={this.updateTitle}
				  onRemove={this.remove}
					onFlip ={this.flipNote}>
				  {note.note}
		    </Note>
		)
	}

	render() {
		if(this.props.location.state === undefined){
			return (<h1>Please sign in to access the board</h1>);
		}
		return (
			<div className={`board board_${this.state.mode}`}>
			<h1><ReactMarkdown source={this.state.boardTitle} /></h1>
			<button id="nav" onClick={this.openSearch}><SearchIcon /></button>
			<button id="nav" onClick={this.openNav}><More /></button>
			<Search closeSearch = {this.closeSearch}
									boardId = {this.boardId}
									mode = {this.state.mode}
									refresh = {this.state.refresh}/>
			<Navigation closeNav = {this.closeNav}
									logout = {this.logout}
									boardId = {this.boardId}
									userId = {this.props.location.state.userId}/>
			{
				this.state.notes.length !== 0 && this.state.loading ? <Loading /> :
				<div>
				<div className ="Grid animated bounceInUp">
				{this.state.notes.map(this.eachNote)}
				</div>
				<button onClick={this.add.bind(null, "New Note")}
						id="add">
					<FaPlus />
				</button>
					</div>
				}
			</div>
		)
	}
}
export default Board
