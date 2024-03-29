'use strict'

const Boom = require('boom')
const isUuid = require('is-uuid')
const getCategories = require('../../getCategories.js')
const getNodesChildrenOfTaxonomyObject = require('../../getNodesChildrenOfTaxonomyObject.js')
const getNodesChildrenOfTaxonomy = require('../../getNodesChildrenOfTaxonomy.js')
const getNodesChildrenOfCategory = require('../../getNodesChildrenOfCategory.js')
const getTaxonomyId = require('../../getTaxonomyId.js')
const getTaxonomyObjectFromId = require('../../getTaxonomyObjectFromId.js')

module.exports = (request, reply) => {
  const {
    type,
    id,
  } = request.params

  const cases = {
    category() {
      getCategories()
        .then((categories) => {
          if (!categories.includes(id)) {
            return reply(Boom.badRequest(
              `Es existiert keine Gruppe '${id}'. Verfügbare Gruppen sind: '${categories.join("', '")}'`
            ))
          }
          getNodesChildrenOfCategory(id)
            .then((response) =>
              reply(null, response)
            )
            .catch((error) =>
              reply(Boom.badImplementation(error), null)
            )
        })
    },
    taxonomy() {
      // ensure a guid is passed as id
      if (!isUuid.v4(id)) {
        return reply(Boom.badRequest(
          `Die übergebene ID der Taxonomie muss eine gültige GUID sein`
        ))
      }
      getTaxonomyId(id)
        .catch(() =>
          reply(Boom.badRequest(
            `Es existiert keine Taxonomie mit der id '${id}'`
          ))
        )
        // get children
        .then(() => getNodesChildrenOfTaxonomy(id))
        .then((children) => {
          if (!!children && (children.length || children.length === 0)) {
            reply(null, children)
          } else {
            reply(Boom.badImplementation('no children received'), null)
          }
        })
        .catch((error) =>
          reply(Boom.badImplementation(error), null)
        )
    },
    taxonomy_object() {
      // ensure a guid is passed as id
      if (!isUuid.v4(id)) {
        return reply(Boom.badRequest(
          `Die übergebene ID des Taxonomie-Objekts muss eine gültige GUID sein`
        ))
      }
      getTaxonomyObjectFromId(id)
        .catch(() =>
          reply(Boom.badRequest(
            `Es existiert kein Taxonomie-Objekt mit der id '${id}'`
          ))
        )
        // get children
        .then(() =>
          getNodesChildrenOfTaxonomyObject(id)
            .then((children) => {
              if (!!children && (children.length || children.length === 0)) {
                reply(null, children)
              } else {
                reply(Boom.badImplementation('no children received'), null)
              }
            })
            .catch((error) =>
              reply(Boom.badImplementation(error), null)
            )
        )
    }
  }

  cases[type]()
}
