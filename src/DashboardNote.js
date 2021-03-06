import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import FaPencil from 'react-icons/lib/fa/pencil'
import FaTrash from 'react-icons/lib/fa/trash'
import FaFloppyO from 'react-icons/lib/fa/floppy-o'
import {Link} from 'react-router-dom';
import './dashboardNote.css';

class DashboardNote extends Component {
  constructor(props){
		super(props)
		this.state = {
      editing: false
    }
    this.edit = this.edit.bind(this)
		this.remove = this.remove.bind(this)
		this.save = this.save.bind(this)
		this.renderForm = this.renderForm.bind(this)
		this.renderDisplay = this.renderDisplay.bind(this)
	}

  componentDidUpdate(){
    var textArea
    if (this.state.editing){
      textArea = this._newText
      textArea.focus()
      textArea.select()
    }
  }

  shouldComponentUpdate(nextProps,nextState){
		return (
			this.props.mode !== nextProps.mode|| this.props.boardTitle !== nextProps.boardTitle|| this.state !== nextState
			)
	}

  edit(){
		this.setState({
			editing: true
		})
	}

	remove(){
		this.props.onRemove(this.props.boardId)
	}

  save(e){
		e.preventDefault()
		this.props.onChange(this._newText.value,this.props.boardId)
		this.setState({
			editing:false
		})
	}

  renderDisplay() {
    console.log("we are render dislpay");
    return (

      <div className = "dashboard_note">
      <Link to={{
        pathname : `/board`,
        state : {
          boardId: this.props.boardId,
        userId : this.props.userId,
        boardId : this.props.boardId
      }
    }} className = "note-link">
    <img src = {`/${this.props.mode}_background.png`}
    alt = {`/${this.props.mode}_background`}
    className = "note-image" />
      </Link>
      <div className = "container_dash">
        <div onClick={this.edit}>
              <ReactMarkdown
              className = 'dashboardBoardTitle'
              source={this.props.boardTitle} /></div>
        <span>
            <button onClick={this.edit} id="edit"><FaPencil /></button>
            <button onClick={this.remove} id="remove"><FaTrash /></button>
        </span>
  			</div>
        </div>

    )
  }

  renderForm() {
    return (
      <div className = "dashboard_note">
        <img src = {`/${this.props.mode}_background.png`}
        alt = {`/${this.props.mode}_background`}
        className = "note-image"/>
        <div className = "container">
          <form onSubmit={this.save}>
              <textarea ref={input => this._newText = input}
                  defaultValue={this.props.boardTitle}/>
                  <button id="save"><FaFloppyO/></button>
          </form>
        </div>
      </div>
    )
  }

  render(){
		return (
      <div className = "animated bounceInUp">
      {this.state.editing ? this.renderForm():this.renderDisplay()}
      </div>
    )
	}
}

export default DashboardNote;
