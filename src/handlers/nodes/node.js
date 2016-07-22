'use strict'

const Boom = require('boom')
const isUuid = require('is-uuid')
const getNodesCategories = require('../../getNodesCategories.js')
const getNodesChildrenOfTaxonomyObject = require('../../getNodesChildrenOfTaxonomyObject.js')
const getNodesChildrenOfTaxonomy = require('../../getNodesChildrenOfTaxonomy.js')
const getNodesChildrenOfCategory = require('../../getNodesChildrenOfCategory.js')
const getNodesAncestorsOfTaxonomyObject = require('../../getNodesAncestorsOfTaxonomyObject.js')
const getNodesTaxonomies = require('../../getNodesTaxonomies.js')
const getCategoryOfTaxonomyObject = require('../../getCategoryOfTaxonomyObject.js')
const getNodesTaxonomiesOfCategory = require('../../getNodesTaxonomiesOfCategory.js')
const getTaxonomyObjectIdFromObjectId = require('../../getTaxonomyObjectIdFromObjectId.js')

module.exports = (request, reply) => {
  let {
    type,
    id,
  } = request.params
  let categoryNodes = []
  let nodes = []

  const cases = {
    category() {
      const categoryIds = categoryNodes.map((c) => c.name)
      if (!categoryIds.includes(id)) {
        return reply(Boom.badRequest(
          `Es existiert keine Gruppe '${id}'. Verfügbare Gruppen sind: '${categoryIds.join("', '")}'`
        ))
      }
      getNodesChildrenOfCategory(id)
        .then((children) => {
          nodes = nodes.concat(children)
          reply(null, nodes)
        })
        .catch((error) =>
          reply(Boom.badImplementation(error), null)
        )
    },
    taxonomy() {
      // ensure a guid is passed as id
      if (!isUuid.v4(id)) {
        return reply(Boom.badRequest(
          `Die übergebene ID der Taxonomie muss eine gültige GUID sein`
        ))
      }
      getNodesTaxonomies(id)
        .catch(() =>
          reply(Boom.badRequest(
            `Es existiert keine Taxonomie mit der id '${id}'`
          ))
        )
        // get children
        .then((taxonomiesNodes) => {
          nodes = nodes.concat(taxonomiesNodes)
          return getNodesChildrenOfTaxonomy(id)
        })
        .then((childrenNodes) => {
          nodes = nodes.concat(childrenNodes)
          reply(null, nodes)
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
      getCategoryOfTaxonomyObject(id)
        .then((result) =>
          getNodesTaxonomiesOfCategory(result.category)
        )
        .catch((error) =>
          reply(Boom.badImplementation(error), null)
        )
        // get children
        .then((taxonomiesNodes) => {
          nodes = nodes.concat(taxonomiesNodes)
          return getNodesChildrenOfTaxonomyObject(id)
        })
        .catch(() =>
          reply(Boom.badRequest(
            `Es existiert kein Taxonomie-Objekt mit der id '${id}'`
          ))
        )
        .then((childrenNodes) => {
          nodes = nodes.concat(childrenNodes)
          return getNodesAncestorsOfTaxonomyObject(id)
        })
        .then((ancestorNodes) => {
          nodes = nodes.concat(ancestorNodes)
          reply(null, nodes)
        })
        .catch((error) =>
          reply(Boom.badImplementation(error), null)
        )
    }
  }

  // TODO:
  // if !id && objectId
  // get taxonomy_object.id from db

  getNodesCategories()
    .then((result) => {
      categoryNodes = result
      nodes = nodes.concat(categoryNodes)
      console.log('handlers/node, id:', id)
      if (type === 'object') {
        return getTaxonomyObjectIdFromObjectId(id)
      }
      return false
    })
    .then((result) => {
      console.log('handlers/node, result:', result)
      if (type === 'object') {
        console.log('handlers/node, result.id:', result.id)
        type = 'taxonomy_object'
        id = result.id
      }
      cases[type]()
    })
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
