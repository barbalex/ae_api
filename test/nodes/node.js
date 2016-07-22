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
const server = require('../../server.js')

// 4. test
describe('/nodes/{type}/{id}/children', () => {
  it(`should return more than 0 rows for type 'category' and id 'Fauna'`, (done) => {
    const url = '/nodes/category/Fauna/children'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(0)
      done()
    })
  })
  it(`should return taxonomies for type 'category' and id 'Fauna'`, (done) => {
    const url = '/nodes/category/Fauna/children'
    server.inject({ method, url }, (res) => {
      expect(res.result[0].type).to.equal('taxonomy')
      done()
    })
  })
  it('should return error if type is not expected', (done) => {
    const url = '/nodes/wrongCategory/Fauna/children'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
})
