'use strict'

const Boom = require('boom')
const categories = require('../../categories.js')
const getNodesChildrenOfTaxonomyObject = require('../../getNodesChildrenOfTaxonomyObject.js')
const getNodesChildrenOfCategory = require('../../getNodesChildrenOfCategory.js')

module.exports = (request, reply) => {
  const {
    type,
    id,
  } = request.params

  const cases = {
    category() {
      if (!categories.includes(id)) {
        return reply(Boom.badRequest(
          `Es existiert keine Gruppe '${id}'. Verfügbare Gruppen sind: '${categories.join("', '")}'`
        ))
      }
      getNodesChildrenOfCategory(id)
        .then((children) => {
          if (children && children.length) {
            return reply(null, children)
          }
          throw 'no children received'  /* eslint no-throw-literal:0 */
        })
        .catch((error) =>
          reply(Boom.badImplementation(error), null)
        )
    },
    taxonomy() {
      // TODO
      // validate id is taxonomy id
    },
    taxonomy_object() {
      // TODO: validate id is taxonomy_object_id
      getNodesChildrenOfTaxonomyObject(id)
        .then((children) => {
          if (children && children.length) {
            return reply(null, children)
          }
          throw 'no children received'  /* eslint no-throw-literal:0 */
        })
        .catch((error) =>
          reply(Boom.badImplementation(error), null)
        )
    }
  }

  cases[type]()
}
