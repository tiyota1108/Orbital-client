import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DashboardNote from './DashboardNote';
import './dashboard.css';
import Board from './Boards';

//need to add in edit and delete board functionalities
const unanthMessage = "Unauthorized user,please login.";

class Dashboard extends Component{
	constructor(props){
		super(props)
		this.state = {
      boards:[],
		}
    var userId;
		this.add = this.add.bind(this);
    this.eachBoard = this.eachBoard.bind(this);
		this.update = this.update.bind(this);
		this.remove = this.remove.bind(this);
		this.logout = this.logout.bind(this);

	}
  componentWillMount() {
    var self = this;
    this.userId = this.props.match.params.id;
    fetch(`http://localhost:3000/board/${this.userId}`, { //added in the second argument to specify token
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
            ///change from here
          self.setState({
            boards: response.boards,
          })
        }
        })
        .catch( (error) => {
        console.log(error);
      })
      //console.log(self.state.notes);

    }

    add(mode) {//adapt the setState to add new key-value pair into the notes object
  		var self = this;
  		fetch(`http://localhost:3000/board/${this.userId}`, {
  			method: 'POST',
  			headers: {
  				'Accept': 'application/json',
  				'Content-Type': 'application/json',
  				'Authorization' : `${localStorage.getItem('jwtToken')}`//add token
  			},
  			body: JSON.stringify({
  				mode: mode,
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
  				boards:[
  				    ...prevState.boards,
  				    {
                boardId: response.boardId,
  							boardTitle: 'Untitled Board',
  				    	mode: mode
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

		shouldComponentUpdate(nextProps, nextState) {
			return (
				this.state !== nextState
			)
		}

		update(newText, boardId) {
			var self = this;
			fetch(`http://localhost:3000/board/${boardId}`, {
				method: 'PUT',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization' : `${localStorage.getItem('jwtToken')}`,
				},
				body: JSON.stringify({
					boardTitle: newText,
				})
			})
			.then(response => response.json())
			.then(response => {
				console.log(response);
				if(response.message === unanthMessage) {
					this.props.history.push("/login");
				} else {
					self.setState(prevState => ({
						boards: prevState.boards.map(
							board => (board.boardId !== boardId) ? board : {...board,boardTitle: newText}
							)
					}));
			}
			})
			.catch( (error) => {
			console.log(error);
		})
		}

		remove(id) {
			var self = this;
			fetch(`http://localhost:3000/board/${id}`, {
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
					boards: prevState.boards.filter(board => board.boardId !== id)
				}));
			}
			})
			.catch( (error) => {
			console.log(error);
		})
		}


		logout = () => {
			localStorage.removeItem('jwtToken');
			window.location.replace('/');
			//window.location.reload();
		}



	eachBoard(board, i) {
    return (
      <DashboardNote
			key = {i}
			boardId = {board.boardId}
			userId = {this.userId}
			mode = {board.mode}
			boardTitle = {board.boardTitle}
			onChange={this.update}
			onRemove={this.remove}
			/>
    )
  }
//			{board.boardTitle}, {board.mode}
//			<img src = "/diary_background.png" alt = "diary_background"/>
//

  render(){
    return (
      <div className = "Dash">
        <header className = "Dash-header">
          <h1> Welcome to 1564! </h1>
        </header>
        <div className = "Exiting-Boards">
          <p>click to open your board</p>
					<div className = "Grid animated bounceInUp">
          {
            this.state.boards.map(this.eachBoard)
          }
					</div>
        </div>
				<p>or, create new boards</p>

        <div className = "Grid">

          <div onClick={()=>this.add("daylight")}
					className = "newBoardButton">
					<img src = {`/daylight_background.png`}
					alt = {`/daylight_background`}
					className = "button-image" />
					</div>
					<div onClick={()=>this.add("diary")}
					className = "newBoardButton">
					<img src = {`/diary_background.png`}
					alt = {`/diary_background`}
					className = "button-image" />
					</div>
					<div onClick={()=>this.add("night")}
					className = "newBoardButton">
					<img src = {`/night_background.png`}
					alt = {`/night_background`}
					className = "button-image" />
					</div>
        </div>
      </div>
    )
  }
}

export default Dashboard;
/*<div>
	<img src = {`/daylight_background.png`}
	alt = {`/daylight_background`}
	className = "note-image" />
</div>
*/

/*
<button onClick={this.add("daylight")}>daylight mode</button>
<button onClick={this.add("dairy")}>dairy mode</button>
<button onClick={this.add("night")}>night mode</button>
*/



// 	componentDidUpdate(){
// 		var textArea
// 		if (this.state.editing){
// 			textArea = this._newText
// 			textArea.focus()
// 			textArea.select()
// 		}
// 	}
//
// 	shouldComponentUpdate(nextProps,nextState){
// 		return (
// 			this.props.children !== nextProps.children|| this.state !== nextState
// 			)
//
// 	}
//
// 	edit(){
// 		this.setState({
// 			editing: true
// 		})
// 	}
// 	remove(){
// 		this.props.onRemove(this.props.index)
// 	}
//
// 	save(e){
// 		e.preventDefault()
// 		this.props.onChange(this._newText.value,this.props.index)
// 		this.setState({
// 			editing:false
// 		})
// 	}
//
// 	_handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//         console.log('do validate');
//         }
//     }
// 	renderForm(){
// 		return (
// 			<div className="card" style={this.style}>
// 			    <form onSubmit={this.save}>
// 			        <textarea ref={input => this._newText = input}
// 			            defaultValue={this.props.children}/>
// 			        <button id="save"><FaFloppyO/></button>
//
//
// 			    </form>
// 			</div>
// 		)
// 	}
//
// 	renderDisplay(){
// 		return (
// 			<div className="card" style={this.style}>
// 			    <p>{this.props.children}</p>
// 			    <span>
// 			        <button onClick={this.edit} id="edit"><FaPencil /></button>
// 			        <button onClick={this.remove} id="remove"><FaTrash /></button>
// 			    </span>
// 			 </div>
// 			)
// 	}
// 	render(){
// 		return this.state.editing ? this.renderForm():this.renderDisplay()
//
//
// 	}
// }
// export default Card
