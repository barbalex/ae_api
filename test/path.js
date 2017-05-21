'use strict'

/* eslint max-len:0 */

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
describe('/path', () => {
  it(`should return array with more than 3 elements for objectId = 'F59DA94B-FF9F-429E-9BAE-02334C2C98AF' and taxonomyId = '5444e7eb-177f-4faf-ba44-0e3da1b391e0'`, done => {
    const url =
      '/path/F59DA94B-FF9F-429E-9BAE-02334C2C98AF/5444e7eb-177f-4faf-ba44-0e3da1b391e0'
    server.inject({ method, url }, res => {
      expect(res.result.length).to.be.above(3)
      done()
    })
  })
  it(`should return array with more than 3 elements for objectId = 'F59DA94B-FF9F-429E-9BAE-02334C2C98AF' and no taxonomyId`, done => {
    const url = '/path/F59DA94B-FF9F-429E-9BAE-02334C2C98AF'
    server.inject({ method, url }, res => {
      expect(res.result.length).to.be.above(3)
      done()
    })
  })
  it(`should return error if objectId is not a valid guid`, done => {
    const url = '/path/notAGuid'
    server.inject({ method, url }, res => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error if taxonomyId is not a valid guid`, done => {
    const url = '/path/F59DA94B-FF9F-429E-9BAE-02334C2C98AF/notAGuid'
    server.inject({ method, url }, res => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error if objectId is not an object id`, done => {
    const url = '/path/5444e7eb-177f-4faf-ba44-0e3da1b391e0'
    server.inject({ method, url }, res => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error if taxonomyId is not an taxonomy id`, done => {
    const url =
      '/path/F59DA94B-FF9F-429E-9BAE-02334C2C98AF/F59DA94B-FF9F-429E-9BAE-02334C2C98AF'
    server.inject({ method, url }, res => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
})
