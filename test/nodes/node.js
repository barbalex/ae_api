'use strict'

/* eslint max-len:0 */

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
describe('/node/{path}/{id?}', () => {
  it(`should return more than 2 rows for path ["Fauna"]`, (done) => {
    const url = '/node/["Fauna"]'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(2)
      done()
    })
  })
  it(`should return a root for path ["Fauna"]`, (done) => {
    const url = '/node/["Fauna"]'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.id === 'root')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a category for path ["Fauna"]`, (done) => {
    const url = '/node/["Fauna"]'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'category')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a Taxonomy for path ["Fauna"]`, (done) => {
    const url = '/node/["Fauna"]'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'taxonomy')
      expect(node).to.exist()
      done()
    })
  })
  it('should return error if category is not valid', (done) => {
    const url = '/node/["wrongCategory"]'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return more than 3 rows for path '["Fauna","CSCF (2009)"]'`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)"]'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(2)
      done()
    })
  })
  it(`should return a root for path '["Fauna","CSCF (2009)"]'`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)"]'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.id === 'root')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a category for path '["Fauna","CSCF (2009)"]'`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)"]'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'category')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a taxonomy for path '["Fauna","CSCF (2009)"]'`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)"]'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'taxonomy')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a taxonomy_object for path '["Fauna","CSCF (2009)"]'`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)"]'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'taxonomy_object')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return error for path '["Fauna","wrongTaxonomy"]'`, (done) => {
    const url = '/node/["Fauna","wrongTaxonomy"]'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error for path '["wrongCategory","CSCF (2009)"]'`, (done) => {
    const url = '/node/["wrongCategory","CSCF%20(2009)"]'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(
    `should return more than 4 rows for path ["Fauna","CSCF (2009)","Aves"]`,
    (done) => {
      const url = '/node/["Fauna","CSCF%20(2009)","Aves"]'
      server.inject({ method, url }, (res) => {
        expect(res.result.length).to.be.above(3)
        done()
      })
    }
  )
  it(
    `should return more than 4 rows for path ["Fauna","CSCF (2009)","Aves","Passeriformes"]`,
    (done) => {
      const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes"]'
      server.inject({ method, url }, (res) => {
        expect(res.result.length).to.be.above(3)
        done()
      })
    }
  )
  it(
    `should return more than 4 rows for path ["Fauna","CSCF (2009)","Aves","Passeriformes","Corvidae"]`,
    (done) => {
      const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae"]'
      server.inject({ method, url }, (res) => {
        expect(res.result.length).to.be.above(3)
        done()
      })
    }
  )
  it(
    `should return more than 4 rows for path ["Fauna","CSCF (2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"]`,
    (done) => {
      const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"]'
      server.inject({ method, url }, (res) => {
        expect(res.result.length).to.be.above(3)
        done()
      })
    }
  )
  it(
    `should return more than 4 rows for path ["Fauna","CSCF (2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"] and id '9C84D038-5BC4-4327-8389-FE6423E14600'`,
    (done) => {
      const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"]/9C84D038-5BC4-4327-8389-FE6423E14600'
      server.inject({ method, url }, (res) => {
        expect(res.result.length).to.be.above(3)
        done()
      })
    }
  )
  it(`should return a root for path ["Fauna","CSCF (2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"] and id '9C84D038-5BC4-4327-8389-FE6423E14600'`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"]/9C84D038-5BC4-4327-8389-FE6423E14600'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.id === 'root')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a category for path ["Fauna","CSCF (2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"] and id '9C84D038-5BC4-4327-8389-FE6423E14600'`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"]/9C84D038-5BC4-4327-8389-FE6423E14600'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'category')
      expect(node).to.exist()
      done()
    })
  })
  it(`should return a taxonomy for path ["Fauna","CSCF (2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"] and id '9C84D038-5BC4-4327-8389-FE6423E14600'`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"]/9C84D038-5BC4-4327-8389-FE6423E14600'
    server.inject({ method, url }, (res) => {
      const node = res.result.find((n) => n.type === 'taxonomy')
      expect(node).to.exist()
      done()
    })
  })
  it(
    `should return a taxonomy_object for path ["Fauna","CSCF (2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"] and id '9C84D038-5BC4-4327-8389-FE6423E14600'`,
    (done) => {
      const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"]/9C84D038-5BC4-4327-8389-FE6423E14600'
      server.inject({ method, url }, (res) => {
        const node = res.result.find((n) => n.type === 'taxonomy_object')
        expect(node).to.exist()
        done()
      })
    }
  )
  it(`should return error if id is not an object`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"]/9C84D038-5BC4-4327-8389-FE6423E14611'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error for type 'taxonomy_object' if id is not a valid guid`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae","Corvus%20corone%20(Raben(Nebel-)krähe)"]/notAValidGuid'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
  it(`should return error if no taxonomy_object exists with this hierarchy`, (done) => {
    const url = '/node/["Fauna","CSCF%20(2009)","Aves","Passeriformes","Corvidae","notAnExistingName"]'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })
})
