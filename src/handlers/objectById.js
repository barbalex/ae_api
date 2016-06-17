'use strict'

/**
 * builds an object of the form:
 * {
 *   id: xxx,
 *   category: xxx,
 *   organization_id: xxx,
 *   relationCollections: [
 *     {
 *       id: xxx,
 *       name: xxx,
 *       description: xxx,
 *       links: xxx,
 *       nature_of_relation: xxx,
 *       combining: xxx,
 *       organization_id: xxx,
 *       last_updated: xxx,
 *       terms_of_use: xxx,
 *       imported_by: xxx,
 *       relations: [
 *         {
 *           id: xxx,
 *           properties: xxx,
 *           relationPartners: [
 *             {
 *               object_id: xxx
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ],
 *   propertyCollections: [
 *     {
 *       id: xxx,
 *       name: xxx,
 *       description: xxx,
 *       links: xxx,
 *       combining: xxx,
 *       organization_id: xxx,
 *       last_updated: xxx,
 *       terms_of_use: xxx,
 *       imported_by: xxx,
 *       properties: xxx
 *     }
 *   ],
 *   taxonomies: [
 *     {
 *       id: xxx,
 *       taxonomy_name: xxx,
 *       description: xxx,
 *       links: xxx,
 *       last_updated: xxx,
 *       organization_id: xxx,
 *       category: xxx,
 *       is_category_standard: xxx,
 *       parent_id: xxx,
 *       object_name: xxx,
 *       properties: xxx
 *     }
 *   ]
 * }
 */

const Boom = require(`boom`)
const getObjectById = require(`../getObjectById.js`)
const getRelationCollectionsByObject = require(`../getRelationCollectionsByObject.js`)
const getPropertyCollectionsByObject = require(`../getPropertyCollectionsByObject.js`)
const getTaxonomiesByObject = require(`../getTaxonomiesByObject.js`)
const escapeStringForSql = require(`../escapeStringForSql.js`)

module.exports = (request, reply) => {
  const id = escapeStringForSql(request.params.id)
  let object

  getObjectById(id)
    .then((data) => {
      object = data
      return getRelationCollectionsByObject(id)
    })
    .then((relationCollections) => {
      object.relationCollections = relationCollections
      return getPropertyCollectionsByObject(id)
    })
    .then((propertyCollections) => {
      object.propertyCollections = propertyCollections
      return getTaxonomiesByObject(id)
    })
    .then((taxonomies) => {
      object.taxonomies = taxonomies
      return
    })
    .then(() => reply(null, object))
    .catch((error) => reply(Boom.badImplementation(error), null))
}
