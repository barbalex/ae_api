'use strict'

// 1. Load modules
const Code = require('code')
const Lab = require('lab')

// 2. set up shortcuts
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect
const method = 'GET'

// 3. start server
const server = require('../server.js')

// 4. test
describe('/object', () => {
  it(`should return object with correct id for id = 'f59da94b-ff9f-429e-9bae-02334c2c98af'`, (done) => {
    const url = '/object/f59da94b-ff9f-429e-9bae-02334c2c98af'
    server.inject({ method, url }, (res) => {
      expect(res.result.id).to.equal('f59da94b-ff9f-429e-9bae-02334c2c98af')
      done()
    })
  })
})
