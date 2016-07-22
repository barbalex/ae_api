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
  it(`should return error if type is 'category' and id is not a category id`, (done) => {
    const url = '/nodes/category/wrongId/children'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return more than 0 rows for type 'taxonomy' and id '5444e7eb-177f-4faf-ba44-0e3da1b391e0'`, (done) => {
    const url = '/nodes/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0/children'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(0)
      done()
    })
  })
  it(`should return taxonomy_objects for type 'taxonomy' and id '5444e7eb-177f-4faf-ba44-0e3da1b391e0'`, (done) => {
    const url = '/nodes/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0/children'
    server.inject({ method, url }, (res) => {
      expect(res.result[0].type).to.equal('taxonomy_object')
      done()
    })
  })
  it(`should return error if type is 'taxonomy' and id is not a taxonomy id`, (done) => {
    const url = '/nodes/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391ee/children'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  // TODO: get this to work
  it(`should return more than 0 rows for type 'taxonomy_object' and id 'ff56b132-ecdf-4301-8c62-b24b3e258b93'`, (done) => {
    const url = '/nodes/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b93/children'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(0)
      done()
    })
  })
})
