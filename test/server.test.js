'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function() {
  it('true should be true', function() {
    expect(true).to.be.true;
  });
  it('2 + 2 should equal 4', function() {
    expect(2 + 2).to.equal(4);
  });
});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});
// could not figure out how to test for an empty array on incorrect query... moved on.
describe('GET /api/notes', function() {
  it('should return the default of 10 Notes as an array', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body.length).to.be.at.least(10);
        const expectedKeys = ["id", "title", "content"];
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });
});
describe('GET /api/notes/:id', function() {
  it('should return correct not object', function() {
    return chai.request(app)
      .get('/api/notes/1001')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        // expect(res.body.length).to.equal(1);
      });
  });
  it('should respond with 404 for invalid id', function() {
    return chai.request(app)
      .get('/api/notes/10000')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});
describe('POST /api/notes', function() {
  it('should create and return a new item with location header when valid', function() {
    const newNote = {title: "TESTING POST", content: "TESTING TESTING TESTING"};
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(res => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.include.keys("id", "title", "content");
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newNote, { id: res.body.id })
        );
      });
  });
  it('should return object with message property "Missing title in request body when missing title', function() {
    const badNote = {content: "whats all the hubabaloo"};
    return chai.request(app)
      .post('/api/notes')
      .send(badNote)
      .then(res => {
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal("Missing `title` in request body");
        console.log(res.body.message);
      });
  });
});

