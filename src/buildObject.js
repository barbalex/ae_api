'use strict'

/**
 * gets an object passed
 *
 * builds and returns an object of the form:
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

const getRelationCollectionsByObject = require('./getRelationCollectionsByObject.js')
const getPropertyCollectionsByObject = require('./getPropertyCollectionsByObject.js')
const getTaxonomiesByObject = require('./getTaxonomiesByObject.js')

module.exports = (objectPassed) =>
  new Promise((resolve, reject) => {
    const object = objectPassed

    getRelationCollectionsByObject(object.id)
      .then((relationCollections) => {
        object.relationCollections = relationCollections
        return getPropertyCollectionsByObject(object.id)
      })
      .then((propertyCollections) => {
        object.propertyCollections = propertyCollections
        return getTaxonomiesByObject(object.id)
      })
      .then((taxonomies) => {
        object.taxonomies = taxonomies
        resolve(object)
      })
      .catch((error) =>
        reject(error)
      )
  })
