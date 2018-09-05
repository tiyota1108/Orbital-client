import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Undo from 'react-icons/lib/io/ios-undo';
import NoteSearch from './NoteSearch';
import algoliasearch from 'algoliasearch';

import './boards.css'
import './search.css'

const unanthMessage = "Unauthorized user,please login.";
export const client = algoliasearch('D77JU4R9TE', '21aa35e2685f87d710c4248b7f4137d9');
export const index = client.initIndex('prod_NOTES');


  class Search extends Component {
    constructor(props) {
      super(props);
      this.state = {
				searchText: "",
				notes:[],
      }
      this.eachHit = this.eachHit.bind(this);
			this.clearSearch = this.clearSearch.bind(this);
    }


    shouldComponentUpdate(nextProps, nextState) {
  		return (
  			this.props!== nextProps|| this.state !== nextState
  		)
  	}

    eachHit(hit) {
			var note_html = "";
			var cards_html =[];
      if(hit._highlightResult) {
        note_html = hit._highlightResult.noteTitle.value;
				if(hit._highlightResult.cards){
					cards_html = hit._highlightResult.cards.map((card)=>({...card,
						cardContent: card.cardContent.value}));
					} else {
						cards_html = hit.cards;
					}
      } else {
        note_html = hit.noteTitle;
				cards_html = hit.cards;
      }
      return (
        <NoteSearch key={hit.objectID}
            index={hit.objectID}
            duration = {150}
            mode = {this.props.mode}
            animation = {hit.animation}
            cards = {cards_html}
            >
						{note_html}

          </NoteSearch>
        );
    }


		search(event) {
		    this.setState({ searchText: event.target.value })
		    index.search(event.target.value,
					{filters: `boardId:${this.props.boardId}`},
					(error, data) => {
		      this.setState({ notes: data.hits })
		    })
		  }

		clearSearch() {
			this.setState({ searchText: "",
											notes:[],});
			index.clearCache();
			this.props.closeSearch();
		}

    render() {
      return (
        <div id = "mySearch" className = "search_overlay">
          <a className = "closebtn"
              onClick = {() => this.clearSearch()}>&times;</a>
					<input
			 			className="searchbox"
			 			type="text"
						placeholder = "enter text to start searching"
			 			value={this.state.searchText}
			 			onChange={this.search.bind(this)} />
						<button id ="undo"
							onClick = {() => {
								this.setState({searchText :"",notes:[]})}}><Undo/></button>
					<div className ="Grid animated bounceInUp">
					{this.state.notes.map(this.eachHit)}
					</div>
          </div>
      )
    }
  }

  export default Search;
