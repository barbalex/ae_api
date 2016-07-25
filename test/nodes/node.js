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
      const node = res.result.find((n) => n.id === 'root')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a category for type 'category' and id 'Fauna'`, (done) => {
    const url = '/node/category/Fauna'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'category')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a Taxonomy for type 'category' and id 'Fauna'`, (done) => {
    const url = '/node/category/Fauna'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'taxonomy')
      expect(node).to.exist()
      done()
    })
  })
  it('should return error if type is not expected', (done) => {
    const url = '/node/wrongType/Fauna'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error for type 'category' if id is not a category`, (done) => {
    const url = '/node/category/wrongId'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return more than 3 rows for type 'taxonomy' and id '5444e7eb-177f-4faf-ba44-0e3da1b391e0'`, (done) => {
    const url = '/node/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(2)
      done()
    })
  })
  it(`should return a root for type 'taxonomy' and id '5444e7eb-177f-4faf-ba44-0e3da1b391e0'`, (done) => {
    const url = '/node/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.id === 'root')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a category for type 'taxonomy' and id '5444e7eb-177f-4faf-ba44-0e3da1b391e0'`, (done) => {
    const url = '/node/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'category')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a taxonomy for type 'taxonomy' and id '5444e7eb-177f-4faf-ba44-0e3da1b391e0'`, (done) => {
    const url = '/node/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'taxonomy')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a taxonomy_object for type 'taxonomy' and id '5444e7eb-177f-4faf-ba44-0e3da1b391e0'`, (done) => {
    const url = '/node/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391e0'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'taxonomy_object')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return error for type 'taxonomy' if id is not a taxonomy`, (done) => {
    const url = '/node/taxonomy/5444e7eb-177f-4faf-ba44-0e3da1b391ee'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error for type 'taxonomy' if id is not a valid guid`, (done) => {
    const url = '/node/taxonomy/notAGuid'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  // TODO: tests for /node/taxonomy_object
  it(`should return more than 4 rows for type 'taxonomy_object' and id 'ff56b132-ecdf-4301-8c62-b24b3e258b93'`, (done) => {
    const url = '/node/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b93'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(3)
      done()
    })
  })
  it(`should return a root for type 'taxonomy_object' and id 'ff56b132-ecdf-4301-8c62-b24b3e258b93'`, (done) => {
    const url = '/node/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b93'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.id === 'root')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a category for type 'taxonomy_object' and id 'ff56b132-ecdf-4301-8c62-b24b3e258b93'`, (done) => {
    const url = '/node/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b93'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'category')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a taxonomy for type 'taxonomy_object' and id 'ff56b132-ecdf-4301-8c62-b24b3e258b93'`, (done) => {
    const url = '/node/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b93'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'taxonomy')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a taxonomy_object for type 'taxonomy_object' and id 'ff56b132-ecdf-4301-8c62-b24b3e258b93'`, (done) => {
    const url = '/node/taxonomy_object/ff56b132-ecdf-4301-8c62-b24b3e258b93'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'taxonomy_object')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return error for type 'taxonomy_object' if id is not a taxonomy_object`, (done) => {
    const url = '/node/taxonomy_object/08ff3989-779b-406f-b015-ea6de301513f'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error for type 'taxonomy_object' if id is not a valid guid`, (done) => {
    const url = '/node/taxonomy_object/notAGuid'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
})
