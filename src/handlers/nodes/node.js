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
const getTaxonomyObject = require('../../getTaxonomyObject.js')
const getTaxonomyObjectFromPath = required('../../getTaxonomyObjectFromPath.js')

module.exports = (request, reply) => {
  const { path } = request.params
  let { id } = request.params
  let nodes = []

  const replyWithCategoryNodes = () => {
    const categoryIds = nodes.map((c) => c.name)
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
  }

  const replyWithTaxonomyNodes = () => {
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
  }

  const replyWithTaxonomyObjectNodes = () => {
    getTaxonomyObjectIdFromObjectId(id)
      .catch(() =>
        reply(Boom.badRequest(
          `Es existiert kein Objekt mit der id '${id}'`
        ))
      )
      .then((taxObjectId) => {
        id = taxObjectId
        return getTaxonomyObject(id)
      })
      .then(() =>
        getCategoryOfTaxonomyObject(id)
      )
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
        reply(null, nodes)
      })
      .catch((error) =>
        reply(Boom.badImplementation(error), null)
      )
  }

  const replyWithTaxonomyObjectNodesWithoutId = () => {
    // need to find taxonomy object by its path
    getTaxonomyObjectFromPath(path)
      .then(())
  }

  // we always need category nodes, so get them first
  getNodesCategories()
    .then((categoryNodes) => {
      nodes = nodes.concat(categoryNodes)

      // analyse path
      if (path.length === 1 && isUuid.v4(path[0])) {
        // this is a path of style /<objectId>
        id = path[0]
        replyWithTaxonomyObjectNodes()
      } else if (path.length === 1 && path[0] === 'index.html' && id) {
        // this is a path of style /index.html?id=<objectId>
        // it was used in a previous app version
        // and is still called by ALT and EvAB
        replyWithTaxonomyObjectNodes()
      } else if (path.length === 1) {
        id = path[0]
        replyWithCategoryNodes()
      } else if (path.length === 2) {
        replyWithTaxonomyNodes()
      } else if (id) {
        // this is a regular object node
        replyWithTaxonomyObjectNodes()
      } else {
        // this is a taxonomy_node without object
        // TODO
      }
    })
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
