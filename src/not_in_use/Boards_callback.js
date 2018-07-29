import React, { Component } from 'react'
import Note from './Notes'
import FaPlus from 'react-icons/lib/fa/plus'
import FaTrash from 'react-icons/lib/fa/trash'
import More from 'react-icons/lib/io/android-more-horizontal'
import Card from './Card'
import Loading from './Loading'
import Navigation from './Navigation'
import './boards.css'

//Boards now is the one with the original data structure and adpted
//to multi-page. Borads 3 is the one with changed data structure
//and adaptation to multi-page.Boards_ori is the one without any adaptation

const unanthMessage = "Unauthorized user,please login.";
class Board extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			notes: []
		}
		var boardId;
		this.add = this.add.bind(this)
		this.eachNote = this.eachNote.bind(this)
		this.updateTitle = this.updateTitle.bind(this)
		this.remove = this.remove.bind(this)
		this.logout = this.logout.bind(this)//add logout method
		this.openNav = this.openNav.bind(this)
		this.closeNav = this.closeNav.bind(this)
		this.flipNote = this.flipNote.bind(this)
	}
	//retriving data from server before mounting borad
	componentWillMount() {//should i use will or did, i use will here to ensure the loading state works
		var self = this;
		this.boardId = this.props.match.params.id;
		setTimeout(() => this.setState({loading: false}), 1000);//load

		fetch(`http://localhost:3000/note/${this.boardId}`, { //added in the second argument to specify token
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`
			}
		})
				.then(response => response.json())
				.then(response => {
					console.log(response);
					if(response.message === unanthMessage) {
						this.props.history.push("/login");
						//console.log("hello");
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
					//self.setState({notes :response});
				})
				.catch( (error) => {
				console.log(error);
			})

		}
		//-----------------------------------------------------------------------

	add(note) {
		var self = this;
		fetch(`http://localhost:3000/note/${this.boardId}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`//add token
			},
			body: JSON.stringify({
				noteTitle: note,
			})
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
			if(response.message === unanthMessage) {
				this.props.history.push("/login");
				//console.log("hello");
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
		}
		})
		.catch( (error) => {
			if(error.response)
		console.log(error);
	})
	}

	updateTitle(newNoteTitle, i) {
		var self = this;
		fetch(`http://localhost:3000/note/${i}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`//add token
			},
			body: JSON.stringify({
				noteTitle: newNoteTitle,
			})
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
			if(response.message === unanthMessage) {
				this.props.history.push("/login");
				//console.log("hello");
			} else {
			self.setState(prevState => ({
				notes: prevState.notes.map(
					note => (note.id !== i) ? note : {...note,note: newNoteTitle}
					)
			}));
		}
		})
		.catch((error) => {
		console.log(error);
		if(error.response.status === 401) {//try to access without authen
			this.props.history.push("/login");//can directly use history?
		}
	});
	}
	//------------------------------------------------------------------------

	remove(id) {
		console.log('removing item at', id)
		var self = this;
		fetch(`http://localhost:3000/note/${id}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`//add token
			}
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
			if(response.message === unanthMessage) {
				this.props.history.push("/login");
				//console.log("hello");
			} else {
			self.setState(prevState => ({
				notes: prevState.notes.filter(note => note.id !== id)
			}));
		}
		})
		.catch( (error) => {
		console.log(error);
	})
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
    //window.location.reload();
  }
	/*--------for flipping-------------------------------------*/
	flipNote(noteId, side) {
		var self = this;
		fetch(`http://localhost:3000/note/${noteId}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization' : `${localStorage.getItem('jwtToken')}`//add token
			},
			body: JSON.stringify({
				animation: side,
			})
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
			if(response.message === unanthMessage) {
				this.props.history.push("/login");
				//console.log("hello");
			} else {
			self.setState(prevState => ({
				notes: prevState.notes.map(
					note => (note.id !== noteId) ? note : {...note,animation: side}
					)
			}));
		}
		})
		.catch((error) => {
		console.log(error);
		if(error.response.status === 401) {//try to access without authen
			this.props.history.push("/login");//can directly use history?
		}
	});
	}

	/*--------for flipping end-------------------------------------*/

	eachNote(note, i) {
		return (
			<Note key={note.id}
				  index={note.id}
					duration = {150}
					mode = {this.state.mode}
					animation = {note.animation}
					cards = {note.cards} //pass down the array of cards objects retrieved from server
				  onChange={this.updateTitle}
				  onRemove={this.remove}
					onFlip ={this.flipNote}>
				  {note.note}
		    </Note>
		)
	}
	//here i added a loading state of 1.5s and wrapped the content in a div,
	//might need to test once the database and the server is deployed.
	render() {//temporary logout button here
		return (
			<div className={`board board_${this.state.mode}`}>
			<h1>{this.state.boardTitle}</h1>
			<button id="nav" onClick={this.openNav}><More /></button>
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
				{localStorage.getItem('jwtToken') &&
						<button className="btn btn-primary" onClick={this.logout}>Logout</button>
					}
					</div>
				}
			</div>
		)
	}
}

export default Board
