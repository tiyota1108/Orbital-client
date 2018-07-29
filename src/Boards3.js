import React, { Component } from 'react'
import Note from './Notes'
import FaPlus from 'react-icons/lib/fa/plus'
import FaTrash from 'react-icons/lib/fa/trash'
import Card from './Card'
import './boards.css'


const unanthMessage = "Unauthorized user,please login.";
class Board extends Component {
	constructor(props) {
		super(props)
		this.state = {
			notes: []
		}
		var userId;
		this.add = this.add.bind(this)
		this.eachNote = this.eachNote.bind(this)
		this.updateTitle = this.updateTitle.bind(this)
		this.remove = this.remove.bind(this)
		this.logout = this.logout.bind(this)//add logout method
	}
	//retriving data from server before mounting borad
	componentWillMount() {
		var self = this;
		this.boardId = this.props.match.params.id;
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
					} else {
					self.setState({
						notes: response.map(note => (
							{id: note._id,
							note: note.noteTitle,
						cards: note.cards}
          )).reduce((obj, note) => {//reduce the array of note objects to one big object with the _ids as keys
            obj[note.id] = note;
            return obj;
          },{})
					})
				}
					//self.setState({notes :response});
				})
				.catch( (error) => {
				console.log(error);
			})
      //console.log(self.state.notes);

		}
		//-----------------------------------------------------------------------

	add(note) {//adapt the setState to add new key-value pair into the notes object
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
				notes:{
				    ...prevState.notes,
				    [response._id] : {
							id:response._id,
				    	note: note,
							cards:[]
				    }
				}
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
			self.setState(prevState => {
        prevState.notes[i].note = newNoteTitle;//here cannot use notes.i must use notes[i], thank you 1101S
        return prevState;
      });
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
			self.setState(prevState => {
        delete prevState.notes[id];
        return prevState;
      });
		}
		})
		.catch( (error) => {
		console.log(error);
	})
	}

	eachNote(noteId, i) {//pass down the cards objects retrieved from server
		return (
			<Note key={noteId}
				  index={noteId}
					cards = {this.state.notes[noteId].cards}
				  onChange={this.updateTitle}
				  onRemove={this.remove}>
				  {this.state.notes[noteId].note}
		    </Note>
		)
	}

	logout = () => {
    localStorage.removeItem('jwtToken');
		window.location.replace('/');
    //window.location.reload();
  }

	render() {//temporary logout button here,//pass each of the note id to the eachNote function
		return (
			<div className="board">
				{Object.keys(this.state.notes).map(this.eachNote)}
				<button onClick={this.add.bind(null, "New Note")}
						id="add">
					<FaPlus />
				</button>
				{localStorage.getItem('jwtToken') &&
						<button class="btn btn-primary" onClick={this.logout}>Logout</button>
					}
			</div>
		)
	}
}

export default Board
