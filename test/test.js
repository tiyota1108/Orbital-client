process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let board = require('../src/Boards');
let note= require('../src/Notes')
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Boards', () => {
    beforeEach((done) => {
        board.remove({}, (err) => { 
           done();         
        });     
    });
  describe('/GET Board', () => {
      it('it should GET all the boards', (done) => {
            chai.request(server)
            .get(next(),'/board')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });
  describe('/POST board', () => {
      it('it should not POST a board without mode', (done) => {
        let board = {
            boardTitle: "Test Board",
            notes:[]
            created_date: Date.now
        }
            chai.request(server)
            .post(next(),'/board')//loginRequired not sure
            .send(board)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('mode');
                res.body.errors.mode.should.have.property('kind').eql('required');
          
              done();
            });
      });
      it('it should POST a board ', (done) => {
        let board = {
            boardTitle: "Test Board1",
            mode:night
            notes:[]
            created_date: Date.now
        }
            chai.request(server)
            .post(next(),'/board')//loginRequired  needed
            .send(board)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
           
                res.body.book.should.have.property('boardTitle');
                res.body.book.should.have.property('mode');
                res.body.book.should.have.property('notes');
                res.body.book.should.have.property('created_date');
              done();
            });
      });

  });
   
  describe('/GET/:boardId notes', () => {
      it('it should GET all notes by the given boardid', (done) => {
        let board = new Board({
            boardTitle: "Test Board",
            notes:[
            {
            "animation": "",
            "_id": {
                "$oid": "5b59dc34f523cf3983484ed8"
            },
            "noteTitle": "New Note",
            "cards": [
                {
                    "_id": {
                        "$oid": "5b59dc37f523cf3983484ed9"
                    },
                    "cardContent": "New Card",
                    "created_date": {
                        "$date": "2018-07-26T14:35:35.589Z"
                    }
                }
            ],
            "created_date": {
                "$date": "2018-07-26T14:35:32.414Z"
            }
        }]
            created_date: Date.now
        });
        board.save((err, board) => {
            chai.request(server)
            .get(next(),next(),'/note/' + board.boardId)
            .send(board)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('noteTitle');
                res.body.should.have.property('cards');
                res.body.should.have.property('created_date');
                res.body.should.have.property('_id').eql(board.boardId);
              done();
            });
        });

      });
  });
  describe('/PUT/:noteId note', () => {
      it('it should UPDATE a notetitle given the noteid', (done) => {
        let note = new Note([
        {
            "animation": "",
            "_id": {
                "$oid": "5b59dc34f523cf3983484ed8"
            },
            "noteTitle": "New Note",
            "cards": [
                {
                    "_id": {
                        "$oid": "5b59dc37f523cf3983484ed9"
                    },
                    "cardContent": "New Card",
                    "created_date": {
                        "$date": "2018-07-26T14:35:35.589Z"
                    }
                }
            ],
            "created_date": {
                "$date": "2018-07-26T14:35:32.414Z"
            }
        }]);
        note.save((err, note) => {
                chai.request(server)
                .put('/note/' + note.noteId)
                .send({
            "animation": "",
            "_id": {
                "$oid": "5b59dc34f523cf3983484e28"
            },
            "noteTitle": "Change",
            "cards": [],
            "created_date": {
                "$date": "2018-07-26T14:35:32.414Z"
            }
          }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.note.should.have.property('noteTitle').eql('Change');
                  done();
                });
          });
      });
  });
 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:boardId board', () => {
      it('it should DELETE a board given the boardId', (done) => {
        let board = new Board({
            boardTitle: "Test Board",
            notes:[
            {
            "animation": "",
            "_id": {
                "$oid": "5b59dc34f523cf3983484ed8"
            },
            "noteTitle": "New Note",
            "cards": [
                {
                    "_id": {
                        "$oid": "5b59dc37f523cf3983484ed9"
                    },
                    "cardContent": "New Card",
                    "created_date": {
                        "$date": "2018-07-26T14:35:35.589Z"
                    }
                }
            ],
            "created_date": {
                "$date": "2018-07-26T14:35:32.414Z"
            }
        }]
            created_date: Date.now
        });
        note.save((err, note) => {
                chai.request(server)
                .delete(next(),'/note/' + note.noteId)
                .end((err, res) => {
                    res.should.have.status(200);
                  done();
                });
          });
      });
  });
});
  