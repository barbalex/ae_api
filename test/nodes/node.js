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
describe('/node/{type}/{id}', () => {
  it(`should return more than 2 rows for type 'category' and id 'Fauna'`, (done) => {
    const url = '/node/category/Fauna'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(2)
      done()
    })
  })
  it(`should return a root for type 'category' and id 'Fauna'`, (done) => {
    const url = '/node/category/Fauna'
    server.inject({ method, url }, (res) => {
      const rootNode = res.result.find((n) => n.id === 'root')
      expect(rootNode).to.exist()
      done()
    })
  })
  it(`should return a category for type 'category' and id 'Fauna'`, (done) => {
    const url = '/node/category/Fauna'
    server.inject({ method, url }, (res) => {
      const categoryNode = res.result.find((n) => n.type === 'category')
      expect(categoryNode).to.exist()
      done()
    })
  })
  it(`should return a Taxonomy for type 'category' and id 'Fauna'`, (done) => {
    const url = '/node/category/Fauna'
    server.inject({ method, url }, (res) => {
      const taxonomyNode = res.result.find((n) => n.type === 'taxonomy')
      expect(taxonomyNode).to.exist()
      done()
    })
  })
  it('should return error if type is not expected', (done) => {
    const url = '/node/wrongCategory/Fauna'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error for type 'category' if id is not a category`, (done) => {
    const url = '/node/wrongCategory/wrongId'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
})
