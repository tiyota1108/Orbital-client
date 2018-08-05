process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let User = require('../src/models/userModel.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

let login_details = {
  'email_or_username': 'email@email.com',
  'password': '123@abc'
}

let register_details = {
  'email': 'email@email.com',
  'password': '123@abc'
};

//let's set up the data we need to pass to the login method

//now let's login the user before we run any tests
var authenticatedUser = request.agent(app);



describe('Create Account, Login and Check Token', () => {
  beforeEach((done) => {
    // Reset user mode before each test
    User.remove({}, (err) => {
      console.log(err);
      done();
    })
  });

  describe('/POST Register', () => {
    it('it should Register, Login, and check token', (done) => {
      chai.request(server)
        .post('/auth/register')
        .send(register_details) 
        .end((err, res) => { // when we get a response from the endpoint
          
          res.should.have.status(201);
          // the property, res.body.state, we expect it to be true.
          expect(res.body.state).to.be.true;

          // follow up with login
          chai.request(server)
            .post('/auth/login')//this part i don't understand
            .send(login_details)
            .end((err, res) => {
              console.log('run the login part');
              res.should.have.status(200);
              expect(res.body.state).to.be.true;
              res.body.should.have.property('token'); 
              
              let token = res.body.token;
              
              chai.request(server)
                .get('/user')
            
                .set('Authorization', token)
                .end((err, res) => {
                  res.should.have.status(200);
                  expect(res.body.state).to.be.true;
                  res.body.data.should.be.an('object');

                  done(); 
                })
            })

        })
    })
  })
})