'use strict'

const Promise = require('bluebird')
const Boom = require('boom')
const Joi = Promise.promisifyAll(require('joi'))
const categories = require('../../categories.js')
const getNodesChildrenOfTaxonomyObject = require('../../getNodesChildrenOfTaxonomyObject.js')
const getNodesChildrenOfTaxonomy = require('../../getNodesChildrenOfTaxonomy.js')
const getNodesChildrenOfCategory = require('../../getNodesChildrenOfCategory.js')
const getTaxonomyId = require('../../getTaxonomyId.js')

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
      Joi.validateAsync(
        id,
        Joi.string().guid()
      )
        .catch(() => reply(Boom.badRequest(
          `Die übergebene Taxonomie ID muss eine gültige GUID sein`
        )))
        .then(() => getTaxonomyId(id))
        .catch(() =>
          reply(Boom.badRequest(
            `Es existiert keine Taxonomie mit der id '${id}'`
          ))
        )
        .then(() => {
          getNodesChildrenOfTaxonomy(id)
            .then((children) => {
              if (children && children.length) {
                return reply(null, children)
              }
              throw 'no children received'  /* eslint no-throw-literal:0 */
            })
            .catch((error) =>
              reply(Boom.badImplementation(error), null)
            )
        })
        .catch((error) => reply(Boom.badImplementation(error), null))
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
