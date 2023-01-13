const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let tempId1, tempId2;

suite('Functional Tests', function() {
  
  suite('POST request tests', () => {
   
    test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
      chai.request(server).post('/api/issues/functional-tests')
        .send({
          issue_title: 'TEST',
          issue_text: 'text',
          created_by: 'Caballou',
          assigned_to: 'unknow',
          status_text: 'error'
        })
        .end((error, res) => {
          tempId1 = res.body._id
          assert.equal(res.body.issue_title, 'TEST')
          assert.equal(res.body.issue_text, 'text')
          assert.equal(res.body.created_by, 'Caballou')
          assert.equal(res.body.assigned_to, 'unknow')
          assert.equal(res.body.status_text, 'error')
          done()
        })
    })

    test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
      chai.request(server).post('/api/issues/functional-tests')
        .send({
          issue_title: 'TEST2',
          issue_text: 'text2',
          created_by: 'Caballou'
        })
        .end((error, res) => {
          tempId2 = res.body._id
          assert.equal(res.body.issue_title, 'TEST2')
          assert.equal(res.body.issue_text, 'text2')
          assert.equal(res.body.created_by, 'Caballou')
          assert.equal(res.body.assigned_to, '')
          assert.equal(res.body.status_text, '')
          done()
        })
    })

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
      chai.request(server).post('/api/issues/functional-tests')
        .send({
          issue_text: 'text2',
          created_by: 'Caballou'
        })
        .end((error, res) => {
          assert.equal(res.body.error, 'required field(s) missing')
          done()
        })
    })
  })

  suite('GET request tests', () => {

    test('View issues on a project: GET request to /api/issues/{project}', (done) => {
      chai.request(server).get('/api/issues/functional-tests')
        .end((error, res) => {
          assert.equal(res.body.length, 2)
          done()
        })
    })
    
    test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
      chai.request(server).get('/api/issues/functional-tests')
        .query({ issue_title: 'TEST'})
        .end((error, res) => {
          assert.equal(res.body[0].issue_title, 'TEST')
          assert.equal(res.body[0].issue_text, 'text')
          assert.equal(res.body[0].created_by, 'Caballou')
          assert.equal(res.body[0].assigned_to, 'unknow')
          assert.equal(res.body[0].status_text, 'error')
          done()
        })
    })

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
      chai.request(server).get('/api/issues/functional-tests')
        .query({ issue_title: 'TEST2', created_by: 'Caballou' })
        .end((error, res) => {
          assert.equal(res.body[0].issue_title, 'TEST2')
          assert.equal(res.body[0].issue_text, 'text2')
          assert.equal(res.body[0].created_by, 'Caballou')
          assert.equal(res.body[0].assigned_to, '')
          assert.equal(res.body[0].status_text, '')
          done()
        })
    })
  })

  suite('PUT request tests', () => {

    test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
      chai.request(server).put('/api/issues/functional-tests')
        .send({ _id: tempId1, issue_text: 'New text' })
        .end((error, res) => {
          //console.log(res.body)
          assert.equal(res.body.result, 'successfully updated')
          assert.equal(res.body._id, tempId1 )
          done()
        })
    })

    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
      chai.request(server).put('/api/issues/functional-tests')
      .send({ _id: tempId2, issue_text: 'New text2', assigned_to: 'Me'})
      .end((error, res) => {
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, tempId2)
        done()
      })
    })

    test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
      chai.request(server).put('/api/issues/functional-tests')
      .send({ issue_text: 'New text3'})
      .end((error, res) => {
        assert.equal(res.body.error, 'missing _id')
        done()
      })
    })

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
      chai.request(server).put('/api/issues/functional-tests')
      .send({ _id: '63c0753f2d24ee86694209bf' })
      .end((error, res) => {
        assert.equal(res.body.error, 'no update field(s) sent')
        done()
      })
    })

    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
      chai.request(server).put('/api/issues/functional-tests')
      .send({ _id: 'asd', assigned_to: 'Caballou' })
      .end((error, res) => {
        assert.equal(res.body.error, 'could not update')
        done()
      })
    })
  })

  suite('DELETE request tests', () => {
    test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
      chai.request(server).delete('/api/issues/functional-tests')
        .send({ _id: tempId1 })
        .end((error, res) => {
          assert.equal(res.body.result, 'successfully deleted')
          assert.equal(res.body._id, tempId1)
        })

      chai.request(server).delete('/api/issues/functional-tests')
        .send({ _id: tempId2 })
        .end((error, res) => {
          assert.equal(res.body.result, 'successfully deleted')
          assert.equal(res.body._id, tempId2)
          done()
        })
    })

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
      chai.request(server).delete('/api/issues/functional-tests')
        .send({ _id: 'asd' })
        .end((error, res) => {
          assert.equal(res.body.error, 'could not delete')
          assert.equal(res.body._id, 'asd')
          done()
        })
    })

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
      chai.request(server).delete('/api/issues/functional-tests')
        .send({ })
        .end((error, res) => {
          assert.equal(res.body.error, 'missing _id')
          done()
        })
    })
  })

});
