'use strict'

// 1. Load modules
const Code = require('code')
const Lab = require('lab')

// 2. set up shortcuts
const lab = Lab.script()
exports.lab = lab
const describe = lab.describe
const it = lab.it
const expect = Code.expect
const method = 'GET'

// 3. start server
const server = require('../server.js')

// 4. test
describe('/object', () => {
  it(`should return object with correct id for id = 'f59da94b-ff9f-429e-9bae-02334c2c98af'`, done => {
    const url = '/object/f59da94b-ff9f-429e-9bae-02334c2c98af'
    server.inject({ method, url }, res => {
      expect(res.result.id).to.equal('f59da94b-ff9f-429e-9bae-02334c2c98af')
      done()
    })
  })
  it(`should return error if id is not a valid guid`, done => {
    const url = '/object/notAGuid'
    server.inject({ method, url }, res => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error if id is not an object id`, done => {
    const url = '/object/0000e5ae-00ae-43e4-8bb5-3f3100928506'
    server.inject({ method, url }, res => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
})
