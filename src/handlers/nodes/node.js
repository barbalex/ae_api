'use strict'

/* eslint no-console:0 */

const Boom = require('boom')
const isUuid = require('is-uuid')
const getNodesCategories = require('../../getNodesCategories.js')
const getNodesChildrenOfTaxonomyObject = require('../../getNodesChildrenOfTaxonomyObject.js')
const getNodesChildrenOfTaxonomyByCategoryName = require('../../getNodesChildrenOfTaxonomyByCategoryName.js')
const getNodesChildrenOfCategory = require('../../getNodesChildrenOfCategory.js')
const getNodesAncestorsOfTaxonomyObject = require('../../getNodesAncestorsOfTaxonomyObject.js')
const getNodesTaxonomiesByName = require('../../getNodesTaxonomiesByName.js')
const getCategoryOfTaxonomyObject = require('../../getCategoryOfTaxonomyObject.js')
const getNodesTaxonomiesOfCategory = require('../../getNodesTaxonomiesOfCategory.js')
const getTaxonomyObjectIdFromObjectId = require('../../getTaxonomyObjectIdFromObjectId.js')
const getTaxonomyObject = require('../../getTaxonomyObject.js')
const getTaxonomyObjectFromPath = require('../../getTaxonomyObjectFromPath.js')
const getObjectOfTaxonomyObject = require('../../getObjectOfTaxonomyObject.js')

module.exports = (request, reply) => {
  const { path } = request.params
  let { id } = request.params
  let nodes = []
  let object = null

  const respond = () => reply(null, { nodes, object })

  const replyWithCategoryNode = () => {
    const categoryIds = nodes.map((c) => c.name)
    if (!categoryIds.includes(id)) {
      return reply(Boom.badRequest(
        `Es existiert keine Gruppe '${id}'. Verfügbare Gruppen sind: '${categoryIds.join("', '")}'`
      ))
    }
    getNodesChildrenOfCategory(id)
      .then((children) => {
        nodes = nodes.concat(children)
        respond()
      })
      .catch((error) =>
        reply(Boom.badImplementation(error), null)
      )
  }

  const replyWithTaxonomyNode = () => {
    getNodesTaxonomiesByName(path[0], path[1])
      .catch(() =>
        reply(Boom.badRequest(
          `Es existiert keine Taxonomie mit mit Gruppe '${path[0]}' und Namen '${path[1]}'`
        ))
      )
      // get children
      .then((taxonomiesNodes) => {
        nodes = nodes.concat(taxonomiesNodes)
        return getNodesChildrenOfTaxonomyByCategoryName(path[0], path[1])
      })
      .then((childrenNodes) => {
        nodes = nodes.concat(childrenNodes)
        respond()
      })
      .catch((error) =>
        reply(Boom.badImplementation(error), null)
      )
  }

  const replyWithTaxonomyObjectNodeUsingObjectId = () => {
    getTaxonomyObjectIdFromObjectId(id)
      .catch(() =>
        reply(Boom.badRequest(
          `Es existiert kein Objekt mit der id '${id}'`
        ))
      )
      .then((taxObjectId) => {
        id = taxObjectId
        replyWithTaxonomyObjectNodes()
      })
      .catch((error) =>
        reply(Boom.badImplementation(error), null)
      )
  }

  const replyWithTaxonomyObjectNodes = () => {
    getObjectOfTaxonomyObject(id)
      .then((data) => {
        object = data
        return getCategoryOfTaxonomyObject(id)
      })
      .then((category) =>
        getNodesTaxonomiesOfCategory(category)
      )
      .catch((error) =>
        reply(Boom.badImplementation(error), null)
      )
      // get children
      .then((taxonomiesNodes) => {
        nodes = nodes.concat(taxonomiesNodes)
        return getNodesAncestorsOfTaxonomyObject(id)
      })
      .catch(() =>
        reply(Boom.badRequest(
          `Es existiert kein Taxonomie-Objekt mit der id '${id}'`
        ))
      )
      .then((ancestorNodes) => {
        nodes = nodes.concat(ancestorNodes)
        return getNodesChildrenOfTaxonomyObject(id)
      })
      .then((childrenNodes) => {
        nodes = nodes.concat(childrenNodes)
        respond()
      })
      .catch((error) =>
        reply(Boom.badImplementation(error), null)
      )
  }

  const replyWithTaxonomyObjectNodeWithoutId = () => {
    // need to find taxonomy object by its path
    getTaxonomyObjectFromPath(path)
      .then((taxObject) => {
        id = taxObject.id
        replyWithTaxonomyObjectNodes()
      })
      .catch(() =>
        reply(Boom.badRequest(
          `Es existiert kein Taxonomie-Objekt mit der übergebenen Hierarchie`
        ))
      )
  }

  // we always need category nodes, so get them first
  getNodesCategories()
    .then((categoryNodes) => {
      nodes = nodes.concat(categoryNodes)
      // analyse path
      if (
        path.length === 0 ||  // home
        ['importieren', 'exportieren', 'organisationen'].includes(path[0])
      ) {
        // this is not an object page
        // return only category nodes
        respond()
      } else {
        if (path.length === 1 && isUuid.v4(path[0])) {
          // this is a path of style /<objectId>
          id = path[0]
          replyWithTaxonomyObjectNodeUsingObjectId()
        } else if (path.length === 1 && path[0] === 'index.html' && id) {
          // this is a path of style /index.html?id=<objectId>
          // it was used in a previous app version
          // and is still called by ALT and EvAB
          replyWithTaxonomyObjectNodeUsingObjectId()
        } else if (path.length === 1) {
          id = path[0]
          replyWithCategoryNode()
        } else if (path.length === 2) {
          replyWithTaxonomyNode()
        } else if (id) {
          // this is a regular object node
          replyWithTaxonomyObjectNodeUsingObjectId()
        } else {
          // this is a taxonomy_node without object
          replyWithTaxonomyObjectNodeWithoutId()
        }
      }
    })
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
