import React, {Component} from 'react'
import './noteDemo.css'

class NoteDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  render() {
		console.log("this state is" + this.props.animation );
		return (
			<div className = "demo-flip-container">
			<div className = {`demo-note${this.props.animation}`}>
				<div className = "demo-front" onDoubleClick = {() => this.props.onFlip(" flipped")}>
					<p>{this.props.children}</p>
					<button onClick={this.remove} id="remove">remove</button>
					<button onClick={this.editTitle} id="edit">edit</button>
				</div>
				<div className = "demo-back" onDoubleClick = {() => this.props.onFlip("")}>
					<p>{this.props.children}</p>
				</div>
			</div>
			</div>
		)
	}

}
export default NoteDemo
