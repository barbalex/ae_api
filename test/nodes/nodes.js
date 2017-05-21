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
const server = require('../../server.js')

// 4. test
describe('/nodes', () => {
  it('should return more than 5 rows', done => {
    const url = '/nodes'
    server.inject({ method, url }, res => {
      expect(res.result.length).to.be.above(5)
      done()
    })
  })
  it('first result should be root', done => {
    const url = '/nodes'
    server.inject({ method, url }, res => {
      expect(res.result[0].id).to.equal('root')
      done()
    })
  })
})
